import asyncHandler from '../utils/asyncHandler.js';
import { getPredictions } from '../services/predictionService.js';

const getPredictionOverview = asyncHandler(async (_req, res) => {
  const predictions = await getPredictions();

  res.json({
    success: true,
    data: predictions,
  });
});

export { getPredictionOverview };
