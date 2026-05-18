import { Response } from 'express';
import prisma from '../../config/database';
import { asyncHandler } from '../../utils/helpers';
import { ConflictError, NotFoundError } from '../../utils/errors';
import { AuthRequest } from '../../middleware/auth';

export class WishlistController {
  /** Get user's wishlist */
  getWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
    const items = await prisma.wishlist.findMany({
      where: { userId: req.user!.userId },
      include: {
        product: {
          select: { id: true, name: true, slug: true, price: true, comparePrice: true, image: true, stock: true, unit: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: items });
  });

  /** Add product to wishlist */
  add = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { productId } = req.body;
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundError('Product not found');

    try {
      await prisma.wishlist.create({
        data: { userId: req.user!.userId, productId },
      });
      res.status(201).json({ success: true, message: 'Added to wishlist' });
    } catch {
      throw new ConflictError('Product already in wishlist');
    }
  });

  /** Remove from wishlist */
  remove = asyncHandler(async (req: AuthRequest, res: Response) => {
    await prisma.wishlist.deleteMany({
      where: { userId: req.user!.userId, productId: req.params.productId as string },
    });
    res.json({ success: true, message: 'Removed from wishlist' });
  });
}
