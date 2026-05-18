import { Router, Response } from 'express';
import { authenticate, authorize, AuthRequest } from '../../middleware/auth';
import { AdminUsersService } from './service';

const router = Router();
const svc = new AdminUsersService();

// All routes require authentication and SUPER_ADMIN role
router.use(authenticate, authorize('SUPER_ADMIN'));

/** GET /api/admin-users — list all admin users */
router.get('/', async (_req: AuthRequest, res: Response, next) => {
  try {
    const users = await svc.listAdmins();
    res.json({ success: true, data: users });
  } catch (err) { next(err); }
});

/** GET /api/admin-users/permissions — list available permissions */
router.get('/permissions', async (_req: AuthRequest, res: Response, next) => {
  try {
    res.json({ success: true, data: svc.getAvailablePermissions() });
  } catch (err) { next(err); }
});

/** POST /api/admin-users — create a new admin */
router.post('/', async (req: AuthRequest, res: Response, next) => {
  try {
    const { name, email, password, role = 'ADMIN', permissions = [] } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'name, email, and password are required' });
    }
    const user = await svc.createAdmin({ name, email, password, role, permissions });
    res.status(201).json({ success: true, data: user });
  } catch (err) { next(err); }
});

/** PATCH /api/admin-users/:id — update admin role/permissions */
router.patch('/:id', async (req: AuthRequest, res: Response, next) => {
  try {
    const requesterId = req.user!.userId;
    const user = await svc.updateAdmin(String(req.params.id), requesterId, req.body);
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
});

/** DELETE /api/admin-users/:id — delete an admin */
router.delete('/:id', async (req: AuthRequest, res: Response, next) => {
  try {
    const requesterId = req.user!.userId;
    const result = await svc.deleteAdmin(String(req.params.id), requesterId);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
});

export default router;
