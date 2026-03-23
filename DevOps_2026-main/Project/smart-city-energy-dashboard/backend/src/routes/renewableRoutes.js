import express from 'express';

import {
  createRenewableRecord,
  deleteRenewableRecord,
  getRenewableData,
  updateRenewableRecord,
} from '../controllers/renewableController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getRenewableData);
router.post('/', protect, authorize('admin'), createRenewableRecord);
router.put('/:id', protect, authorize('admin'), updateRenewableRecord);
router.delete('/:id', protect, authorize('admin'), deleteRenewableRecord);

export default router;
