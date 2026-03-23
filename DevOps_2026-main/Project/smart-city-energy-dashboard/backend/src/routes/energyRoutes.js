import express from 'express';

import {
  createEnergyRecord,
  deleteEnergyRecord,
  getEnergyAnalytics,
  updateEnergyRecord,
} from '../controllers/energyController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getEnergyAnalytics);
router.post('/', protect, authorize('admin'), createEnergyRecord);
router.put('/:id', protect, authorize('admin'), updateEnergyRecord);
router.delete('/:id', protect, authorize('admin'), deleteEnergyRecord);

export default router;
