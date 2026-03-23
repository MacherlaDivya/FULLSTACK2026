import express from 'express';

import {
  createBuilding,
  deleteBuilding,
  getBuildingById,
  getBuildings,
  updateBuilding,
} from '../controllers/buildingController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getBuildings).post(protect, authorize('admin'), createBuilding);
router
  .route('/:id')
  .get(protect, getBuildingById)
  .put(protect, authorize('admin'), updateBuilding)
  .delete(protect, authorize('admin'), deleteBuilding);

export default router;
