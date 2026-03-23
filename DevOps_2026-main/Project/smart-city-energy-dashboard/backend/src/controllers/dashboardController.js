import asyncHandler from '../utils/asyncHandler.js';
import {
  getCityDemandAnalysis,
  getDashboardSummary,
} from '../services/analyticsService.js';

const getSummary = asyncHandler(async (_req, res) => {
  const summary = await getDashboardSummary();

  res.json({
    success: true,
    data: summary,
  });
});

const getCityDemand = asyncHandler(async (req, res) => {
  const analysis = await getCityDemandAnalysis(req.query);

  res.json({
    success: true,
    data: analysis,
  });
});

export { getCityDemand, getSummary };
