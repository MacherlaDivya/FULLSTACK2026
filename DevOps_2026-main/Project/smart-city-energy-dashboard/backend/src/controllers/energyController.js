import asyncHandler from '../utils/asyncHandler.js';
import EnergyConsumption from '../models/EnergyConsumption.js';
import {
  getBuildingConsumptionBreakdown,
  getEnergySeries,
  getSeasonalDemand,
} from '../services/analyticsService.js';

const deriveSeason = (dateValue) => {
  const month = new Date(dateValue).getMonth();
  if ([11, 0, 1].includes(month)) return 'winter';
  if ([2, 3, 4].includes(month)) return 'spring';
  if ([5, 6, 7].includes(month)) return 'summer';
  return 'autumn';
};

const getEnergyAnalytics = asyncHandler(async (req, res) => {
  const [series, seasonalDemand, topBuildings, recentRecords] = await Promise.all([
    getEnergySeries(req.query),
    getSeasonalDemand(req.query),
    getBuildingConsumptionBreakdown(req.query),
    EnergyConsumption.find()
      .populate('building', 'name type district')
      .sort({ recordedAt: -1 })
      .limit(15)
      .lean(),
  ]);

  res.json({
    success: true,
    data: {
      series,
      seasonalDemand,
      topBuildings,
      recentRecords,
    },
  });
});

const createEnergyRecord = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    season: req.body.season || deriveSeason(req.body.recordedAt),
  };

  const record = await EnergyConsumption.create(payload);

  res.status(201).json({
    success: true,
    data: record,
  });
});

const updateEnergyRecord = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
  };

  if (payload.recordedAt && !payload.season) {
    payload.season = deriveSeason(payload.recordedAt);
  }

  const record = await EnergyConsumption.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });

  if (!record) {
    const error = new Error('Energy record not found');
    error.statusCode = 404;
    throw error;
  }

  res.json({
    success: true,
    data: record,
  });
});

const deleteEnergyRecord = asyncHandler(async (req, res) => {
  const record = await EnergyConsumption.findByIdAndDelete(req.params.id);

  if (!record) {
    const error = new Error('Energy record not found');
    error.statusCode = 404;
    throw error;
  }

  res.json({
    success: true,
    message: 'Energy record deleted successfully',
  });
});

export {
  createEnergyRecord,
  deleteEnergyRecord,
  getEnergyAnalytics,
  updateEnergyRecord,
};
