import express from 'express';

import {
  deleteUser,
  getAdminOverview,
  getUsers,
  updateUserRole,
} from '../controllers/adminController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, authorize('admin'));
router.get('/overview', getAdminOverview);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

export default router;
