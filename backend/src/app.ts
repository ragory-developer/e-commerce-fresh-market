import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';

// Import routes
import authRoutes from './modules/auth/routes';
import userRoutes from './modules/user/routes';
import categoryRoutes from './modules/category/routes';
import brandRoutes from './modules/brand/routes';
import productRoutes from './modules/product/routes';
import cartRoutes from './modules/cart/routes';
import orderRoutes from './modules/order/routes';
import paymentRoutes from './modules/payment/routes';
import wishlistRoutes from './modules/wishlist/routes';
import mediaRoutes from './modules/media/routes';
import tagRoutes from './modules/tag/routes';
import specificationRoutes from './modules/specification/routes';
import variationRoutes from './modules/variation/routes';
import wordpressRoutes from './modules/wordpress/routes';
import settingRoutes from './modules/setting/routes';
import walletRoutes from './modules/wallet/routes';
import adminUsersRoutes from './modules/adminUsers/routes';
import locationRoutes from './modules/location/routes';
import couponRoutes from './modules/coupon/routes';
import builderRoutes from './modules/builder/routes';
import path from 'path';
import { UserController } from './modules/user/controller';
import { authenticate } from './middleware/auth';

const app = express();

// --- Middleware ---
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// --- Static files (uploads) ---
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// --- Health check ---
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

import pageRoutes from './modules/page/routes';

// --- API Routes ---
app.use('/api/auth', authRoutes);
const userController = new UserController();
app.get('/api/user-stats-service/stats', authenticate, userController.getDashboardStats);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/specifications', specificationRoutes);
app.use('/api/variations', variationRoutes);
app.use('/api/wordpress', wordpressRoutes);
app.use('/api/global-settings', settingRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/admin-users', adminUsersRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/builder', builderRoutes);

// --- 404 handler ---
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// --- Global error handler ---
app.use(errorHandler);

export default app;
