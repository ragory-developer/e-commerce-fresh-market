import { Response } from 'express';
import prisma from '../../config/database';
import { asyncHandler, parsePagination, getActivePrice } from '../../utils/helpers';
import { BadRequestError, NotFoundError } from '../../utils/errors';
import { AuthRequest } from '../../middleware/auth';
import { config } from '../../config';
import { WalletService } from '../wallet/service';
import { sendFacebookEvent } from '../../utils/facebook-capi';

export class OrderController {
  private async calculateOrderTotals(
    userId: string,
    payloadItems: any[],
    couponCode?: string,
    deliveryAreaId?: string,
    deliveryCityId?: string
  ) {
    let orderItems: any[] = [];
    let cartId = null;

    const ignoreStockSetting = await prisma.setting.findUnique({ where: { key: 'ignore_stock_limits' } });
    const ignoreStock = ignoreStockSetting?.value === 'true';

    if (payloadItems && payloadItems.length > 0) {
      // Use items from payload
      for (const pItem of payloadItems) {
        // Try to find as variant first
        const variant = await prisma.productVariant.findUnique({ 
          where: { id: pItem.productId },
          include: { product: true }
        });

        if (variant) {
          if (!ignoreStock && pItem.quantity > variant.stock) {
            throw new BadRequestError(`"${variant.product.name}" (variant) has only ${variant.stock} units in stock.`);
          }
          orderItems.push({
            productId: variant.productId,
            variantId: variant.id,
            quantity: pItem.quantity,
            price: getActivePrice(variant),
            product: variant.product,
          });
        } else {
          // Try to find as simple product
          const product = await prisma.product.findUnique({ where: { id: pItem.productId } });
          if (!product) throw new BadRequestError('Product not found in catalog');
          if (!ignoreStock && pItem.quantity > product.stock) {
            throw new BadRequestError(`"${product.name}" has only ${product.stock} units in stock. Please reduce quantity.`);
          }
          orderItems.push({
            productId: product.id,
            variantId: null,
            quantity: pItem.quantity,
            price: getActivePrice(product),
            product,
          });
        }
      }
    } else {
      // Fallback to database cart items
      const cart = await prisma.cart.findUnique({
        where: { userId },
        include: { items: { include: { product: true, variant: true } } },
      });

      if (!cart || cart.items.length === 0) {
        throw new BadRequestError('Cart is empty');
      }

      for (const item of cart.items) {
        if (!ignoreStock && item.product && item.quantity > item.product.stock) {
          throw new BadRequestError(`"${item.product.name}" has only ${item.product.stock} units in stock`);
        }
        orderItems.push({
          productId: item.productId,
          quantity: item.quantity,
          price: item.variant ? getActivePrice(item.variant) : item.product ? getActivePrice(item.product) : 0,
          product: item.product,
        });
      }
      cartId = cart.id;
    }

    if (orderItems.length === 0) throw new BadRequestError('No items to order');

    // Calculate subtotal
    let subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    subtotal = Math.round(subtotal * 100) / 100;

    // Calculate delivery fee dynamically
    let deliveryFee = 0; // Default to 0 until area/city is selected

    if (deliveryAreaId) {
      const area = await prisma.area.findUnique({ where: { id: deliveryAreaId } });
      console.log(`[DEBUG] Found area: ${area?.name}, charge: ${area?.deliveryCharge}`);
      if (area && area.deliveryCharge > 0) {
        deliveryFee = area.deliveryCharge;
      } else if (deliveryCityId) {
        const city = await prisma.city.findUnique({ where: { id: deliveryCityId } });
        console.log(`[DEBUG] Area charge 0, checking city: ${city?.name}, charge: ${city?.deliveryCharge}`);
        if (city && city.deliveryCharge > 0) {
          deliveryFee = city.deliveryCharge;
        }
      }
    } else if (deliveryCityId) {
      const city = await prisma.city.findUnique({ where: { id: deliveryCityId } });
      console.log(`[DEBUG] No area, checking city: ${city?.name}, charge: ${city?.deliveryCharge}`);
      if (city && city.deliveryCharge > 0) {
        deliveryFee = city.deliveryCharge;
      }
    }

    console.log(`[DEBUG] Final deliveryFee: ${deliveryFee}`);

    let discount = 0;
    let validCouponId = null;

    // Apply coupon if provided
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
      if (coupon && coupon.active && coupon.usedCount < coupon.maxUses && (!coupon.expiresAt || coupon.expiresAt > new Date())) {
        if (subtotal >= coupon.minOrder) {
          discount = coupon.type === 'PERCENT' ? (subtotal * coupon.discount) / 100 : coupon.discount;
          discount = Math.min(discount, subtotal); // Don't exceed subtotal
          validCouponId = coupon.id;
        } else {
          throw new BadRequestError(`Coupon requires a minimum order of ৳${coupon.minOrder}`);
        }
      } else {
        throw new BadRequestError('Coupon is invalid or has expired');
      }
    }

    const total = Math.round((subtotal + deliveryFee - discount) * 100) / 100;

    return { subtotal, deliveryFee, discount, total, orderItems, cartId, validCouponId };
  }

  /** Calculate order totals dynamically without placing order */
  calculate = asyncHandler(async (req: AuthRequest, res: Response) => {
    // Allow guests - use a placeholder userId that won't match any cart
    const userId = req.user?.userId || 'guest';
    const { items: payloadItems, couponCode, deliveryAreaId, deliveryCityId } = req.body;

    if (!payloadItems || payloadItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items are required' });
    }

    const { subtotal, deliveryFee, discount, total } = await this.calculateOrderTotals(
      userId,
      payloadItems,
      couponCode,
      deliveryAreaId,
      deliveryCityId
    );

    res.json({ success: true, data: { subtotal, deliveryFee, discount, total } });
  });

  /** Place a new order from the user's cart */
  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const { 
      deliveryAddress, deliveryCity, deliveryArea, deliveryCityId, deliveryAreaId, 
      deliveryStateId, deliverySlot, paymentMethod, couponCode, notes, 
      items: payloadItems,
      customerName,
      customerPhone
    } = req.body;

    if (!deliveryAddress) throw new BadRequestError('Delivery address is required');

    // Fetch user for snapshotting if name/phone not provided in body
    const user = await prisma.user.findUnique({ 
      where: { id: userId },
      select: { name: true, phone: true, isGuest: true } 
    });

    const finalName = customerName || user?.name || 'Guest';
    const finalPhone = customerPhone || user?.phone || '';

    const { subtotal, deliveryFee, discount, total, orderItems, cartId, validCouponId } = await this.calculateOrderTotals(
      userId,
      payloadItems,
      couponCode,
      deliveryAreaId,
      deliveryCityId
    );

    // Calculate reward points
    let rewardPoints = 0;
    if (user && !user.isGuest) {
      const rewardAmountSetting = await prisma.setting.findUnique({ where: { key: 'reward_points_amount' } });
      const rewardEarnedSetting = await prisma.setting.findUnique({ where: { key: 'reward_points_earned' } });
      const rewardAmount = parseFloat(rewardAmountSetting?.value || '0');
      const rewardEarned = parseInt(rewardEarnedSetting?.value || '0');

      if (rewardAmount > 0 && rewardEarned > 0) {
        const applicableValue = subtotal - discount; // exclude delivery charge
        if (applicableValue > 0) {
          rewardPoints = Math.floor(applicableValue / rewardAmount) * rewardEarned;
        }
      }
    }

    // Create order with items inside a transaction
    const order = await prisma.$transaction(async (tx) => {
      // If a coupon was applied, increment usedCount inside transaction
      if (validCouponId) {
        await tx.coupon.update({ where: { id: validCouponId }, data: { usedCount: { increment: 1 } } });
      }

      const newOrder = await tx.order.create({
        data: {
          userId,
          customerName: finalName,
          customerPhone: finalPhone,
          subtotal,
          deliveryFee,
          discount,
          rewardPoints,
          total,
          deliveryAddress,
          deliveryCity,
          deliveryArea,
          deliveryStateId,
          deliveryCityId,
          deliveryAreaId,
          deliverySlot,
          paymentMethod: paymentMethod || 'COD',
          couponCode,
          notes,
          items: {
            create: orderItems.map((item) => ({
              productId: item.productId,
              variantId: item.variantId || null,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: { items: { include: { product: { select: { id: true, name: true, image: true } } } } },
      });

      // Decrease stock for each product/variant
      for (const item of orderItems) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          });
        } else if (item.productId) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }

      // Clear the cart if it was DB-based
      if (cartId) {
        await tx.cartItem.deleteMany({ where: { cartId: cartId } });
      }

      // Deduct from global wallet if configured
      if (config.orderDeductionAmount > 0) {
        await WalletService.adjustGlobalBalance(
          -config.orderDeductionAmount,
          'DEDUCTION',
          `Order #${newOrder.id} auto-deduction`,
          undefined,
          tx
        );
      }

      return newOrder;
    });

    // Send Facebook Conversions API event (async/non-blocking)
    const clientIp = req.ip || req.headers['x-forwarded-for']?.toString();
    const userAgent = req.headers['user-agent'];

    sendFacebookEvent({
      eventName: 'Purchase',
      eventSourceUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
      userData: {
        email: user?.isGuest ? undefined : (req.user as any)?.email, // Need to make sure email is available
        phone: order.customerPhone || undefined,
        clientIpAddress: clientIp,
        userAgent: userAgent,
        externalId: order.userId,
      },
      customData: {
        value: order.total,
        currency: 'BDT',
        contentIds: order.items.map((i: any) => i.productId),
        contentType: 'product',
        orderId: order.id,
      }
    }).catch(err => console.error('[FB-CAPI] Execution error:', err));

    res.status(201).json({ success: true, data: order });
  });

  /** Get current user's orders */
  getMyOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page, limit, skip } = parsePagination(req.query as any);
    const userId = req.user!.userId;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        include: { items: { include: { product: { select: { id: true, name: true, image: true, slug: true } } } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where: { userId } }),
    ]);

    res.json({ success: true, data: orders, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  });

  /** Get single order by ID */
  getById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id as string },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        items: { include: { product: { select: { id: true, name: true, image: true, slug: true } } } },
      },
    });
    if (!order) throw new NotFoundError('Order not found');

    // Users can only see their own orders (unless admin)
    if (req.user!.role !== 'ADMIN' && order.userId !== req.user!.userId) {
      throw new NotFoundError('Order not found');
    }

    res.json({ success: true, data: order });
  });

  /** Admin: get all orders */
  getAllOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page, limit, skip } = parsePagination(req.query as any);
    const { status, couponCode, search, userId } = req.query;

    const where: any = {};
    if (status) where.status = status;
    if (couponCode) where.couponCode = couponCode;
    if (userId) where.userId = userId;
    
    if (search) {
      where.OR = [
        { id: { contains: search as string } },
        { user: { name: { contains: search as string } } },
        { user: { phone: { contains: search as string } } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true, phone: true, isGuest: true } },
          items: { include: { product: { select: { id: true, name: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);
    
    console.log(`[DEBUG] Fetched ${orders.length} orders for admin. Total count in DB: ${total}`);

    res.json({ success: true, data: orders, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  });

  /** Admin: update order status */
  updateStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { status } = req.body;
    const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const currentOrder = await prisma.order.findUnique({ 
      where: { id: req.params.id as string },
      include: { user: true }
    });
    
    if (!currentOrder) throw new NotFoundError('Order not found');

    const order = await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id: req.params.id as string },
        data: { status, paymentStatus: status === 'DELIVERED' ? 'PAID' : undefined },
      });

      // Reward points handling
      const isCurrentlyRewardable = ['DELIVERED', 'SHIPPED', 'COMPLETED'].includes(currentOrder.status);
      const isNewRewardable = ['DELIVERED', 'SHIPPED', 'COMPLETED'].includes(status);

      if (!isCurrentlyRewardable && isNewRewardable) {
        // Add points
        if (currentOrder.rewardPoints > 0 && !currentOrder.user.isGuest) {
          await tx.user.update({
            where: { id: currentOrder.userId },
            data: { rewardPoints: { increment: currentOrder.rewardPoints } }
          });
        }
      } else if (isCurrentlyRewardable && !isNewRewardable) {
        // Remove points (e.g. was DELIVERED, now CANCELLED or REFUNDED)
        if (currentOrder.rewardPoints > 0 && !currentOrder.user.isGuest) {
          await tx.user.update({
            where: { id: currentOrder.userId },
            data: { rewardPoints: { decrement: currentOrder.rewardPoints } }
          });
        }
      }

      return updatedOrder;
    });

    res.json({ success: true, data: order });
  });

  /** User: Pay for an existing order (Simulated/Simpler payment) */
  pay = asyncHandler(async (req: AuthRequest, res: Response) => {
    const orderId = req.params.id as string;
    const userId = req.user!.userId;

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    
    if (!order) throw new NotFoundError('Order not found');
    if (order.userId !== userId) throw new NotFoundError('Order not found');
    if (order.paymentStatus === 'PAID') throw new BadRequestError('Order is already paid');

    // Here we would typically redirect to SSLCommerz or bKash
    // For now, let's just mark as PAID to simulate a successful transaction
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: 'PAID' }
    });

    res.json({ success: true, data: updatedOrder, message: 'Payment successful (Simulated)' });
  });
}
