import express from 'express';

import {
  createContactMessage,
  getContactMessages,
  updateContactStatus,
} from '../controllers/contactController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createContactMessage);
router.get('/', protect, authorize('admin'), getContactMessages);
router.put('/:id/status', protect, authorize('admin'), updateContactStatus);

export default router;
