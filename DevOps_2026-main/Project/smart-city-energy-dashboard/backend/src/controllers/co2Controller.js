import asyncHandler from '../utils/asyncHandler.js';
import CO2Emission from '../models/CO2Emission.js';
import { getCO2Analytics } from '../services/analyticsService.js';

const getCO2Data = asyncHandler(async (req, res) => {
  const analytics = await getCO2Analytics(req.query);
  const recentRecords = await CO2Emission.find().sort({ recordedAt: -1 }).limit(15).lean();

  res.json({
    success: true,
    data: {
      ...analytics,
      recentRecords,
    },
  });
});

const createCO2Record = asyncHandler(async (req, res) => {
  const record = await CO2Emission.create(req.body);

  res.status(201).json({
    success: true,
    data: record,
  });
});

const updateCO2Record = asyncHandler(async (req, res) => {
  const record = await CO2Emission.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!record) {
    const error = new Error('CO2 record not found');
    error.statusCode = 404;
    throw error;
  }

  res.json({
    success: true,
    data: record,
  });
});

const deleteCO2Record = asyncHandler(async (req, res) => {
  const record = await CO2Emission.findByIdAndDelete(req.params.id);

  if (!record) {
    const error = new Error('CO2 record not found');
    error.statusCode = 404;
    throw error;
  }

  res.json({
    success: true,
    message: 'CO2 record deleted successfully',
  });
});

export { createCO2Record, deleteCO2Record, getCO2Data, updateCO2Record };
