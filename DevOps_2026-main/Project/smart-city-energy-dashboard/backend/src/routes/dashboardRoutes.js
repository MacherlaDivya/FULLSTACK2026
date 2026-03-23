import express from 'express';

import { getCityDemand, getSummary } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/summary', protect, getSummary);
router.get('/city-demand', protect, getCityDemand);

export default router;
