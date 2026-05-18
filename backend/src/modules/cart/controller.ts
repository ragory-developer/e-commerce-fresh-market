import { Response } from 'express';
import prisma from '../../config/database';
import { asyncHandler, getActivePrice } from '../../utils/helpers';
import { BadRequestError, NotFoundError } from '../../utils/errors';
import { AuthRequest } from '../../middleware/auth';

export class CartController {
  /** Get current user's cart with items */
  getCart = asyncHandler(async (req: AuthRequest, res: Response) => {
    let cart = await prisma.cart.findUnique({
      where: { userId: req.user!.userId },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, slug: true, price: true, specialPrice: true, specialPriceStart: true, specialPriceEnd: true, comparePrice: true, image: true, stock: true, unit: true },
            },
            variant: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    // Create cart if it doesn't exist
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.user!.userId },
        include: { items: { include: { product: { select: { id: true, name: true, slug: true, price: true, specialPrice: true, specialPriceStart: true, specialPriceEnd: true, comparePrice: true, image: true, stock: true, unit: true } }, variant: true } } },
      });
    }

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => sum + (item.variant ? getActivePrice(item.variant) : item.product ? getActivePrice(item.product) : 0) * item.quantity, 0);
    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    res.json({ success: true, data: { ...cart, subtotal: Math.round(subtotal * 100) / 100, itemCount } });
  });

  /** Add an item to the cart (or increment quantity) */
  addItem = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { productId, quantity = 1 } = req.body;
    if (!productId) throw new BadRequestError('Product ID is required');

    const ignoreStockSetting = await prisma.setting.findUnique({ where: { key: 'ignore_stock_limits' } });
    const ignoreStock = ignoreStockSetting?.value === 'true';

    // Check product exists and has stock
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundError('Product not found');
    if (!ignoreStock && product.stock < quantity) throw new BadRequestError('Not enough stock available');

    // Get or create cart
    let cart = await prisma.cart.findUnique({ where: { userId: req.user!.userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: req.user!.userId } });
    }

    // Upsert item: if already in cart, increment quantity
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      if (!ignoreStock && newQty > product.stock) throw new BadRequestError('Not enough stock available');
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQty },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity },
      });
    }

    res.status(201).json({ success: true, message: 'Item added to cart' });
  });

  /** Update item quantity in cart */
  updateItem = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) throw new BadRequestError('Quantity must be at least 1');

    const ignoreStockSetting = await prisma.setting.findUnique({ where: { key: 'ignore_stock_limits' } });
    const ignoreStock = ignoreStockSetting?.value === 'true';

    const item = await prisma.cartItem.findUnique({
      where: { id: req.params.id as string },
      include: { cart: true, product: true },
    }) as any;
    if (!item || item.cart.userId !== req.user!.userId) throw new NotFoundError('Cart item not found');
    if (!ignoreStock && quantity > item.product.stock) throw new BadRequestError('Not enough stock');

    await prisma.cartItem.update({
      where: { id: req.params.id as string },
      data: { quantity },
    });

    res.json({ success: true, message: 'Cart item updated' });
  });

  /** Remove an item from cart */
  removeItem = asyncHandler(async (req: AuthRequest, res: Response) => {
    const item = await prisma.cartItem.findUnique({
      where: { id: req.params.id as string },
      include: { cart: true },
    }) as any;
    if (!item || item.cart.userId !== req.user!.userId) throw new NotFoundError('Cart item not found');

    await prisma.cartItem.delete({ where: { id: req.params.id as string } });
    res.json({ success: true, message: 'Item removed from cart' });
  });

  /** Clear entire cart */
  clearCart = asyncHandler(async (req: AuthRequest, res: Response) => {
    const cart = await prisma.cart.findUnique({ where: { userId: req.user!.userId } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
    res.json({ success: true, message: 'Cart cleared' });
  });
}
