import express from 'express';

import {
  createCO2Record,
  deleteCO2Record,
  getCO2Data,
  updateCO2Record,
} from '../controllers/co2Controller.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getCO2Data);
router.post('/', protect, authorize('admin'), createCO2Record);
router.put('/:id', protect, authorize('admin'), updateCO2Record);
router.delete('/:id', protect, authorize('admin'), deleteCO2Record);

export default router;
