import asyncHandler from '../utils/asyncHandler.js';
import RenewableEnergy from '../models/RenewableEnergy.js';
import { getRenewableAnalytics } from '../services/analyticsService.js';

const getRenewableData = asyncHandler(async (req, res) => {
  const analytics = await getRenewableAnalytics(req.query);
  const recentRecords = await RenewableEnergy.find().sort({ recordedAt: -1 }).limit(15).lean();

  res.json({
    success: true,
    data: {
      ...analytics,
      recentRecords,
    },
  });
});

const createRenewableRecord = asyncHandler(async (req, res) => {
  const record = await RenewableEnergy.create(req.body);

  res.status(201).json({
    success: true,
    data: record,
  });
});

const updateRenewableRecord = asyncHandler(async (req, res) => {
  const record = await RenewableEnergy.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!record) {
    const error = new Error('Renewable record not found');
    error.statusCode = 404;
    throw error;
  }

  res.json({
    success: true,
    data: record,
  });
});

const deleteRenewableRecord = asyncHandler(async (req, res) => {
  const record = await RenewableEnergy.findByIdAndDelete(req.params.id);

  if (!record) {
    const error = new Error('Renewable record not found');
    error.statusCode = 404;
    throw error;
  }

  res.json({
    success: true,
    message: 'Renewable record deleted successfully',
  });
});

export {
  createRenewableRecord,
  deleteRenewableRecord,
  getRenewableData,
  updateRenewableRecord,
};
