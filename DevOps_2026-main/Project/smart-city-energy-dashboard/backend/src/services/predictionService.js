import CO2Emission from '../models/CO2Emission.js';
import EnergyConsumption from '../models/EnergyConsumption.js';
import RenewableEnergy from '../models/RenewableEnergy.js';

const linearRegressionForecast = (values, count, labelPrefix) => {
  if (!values.length) {
    return [];
  }

  const points = values.map((value, index) => ({ x: index + 1, y: value }));
  const n = points.length;
  const sumX = points.reduce((accumulator, point) => accumulator + point.x, 0);
  const sumY = points.reduce((accumulator, point) => accumulator + point.y, 0);
  const sumXY = points.reduce((accumulator, point) => accumulator + point.x * point.y, 0);
  const sumXX = points.reduce((accumulator, point) => accumulator + point.x * point.x, 0);
  const denominator = n * sumXX - sumX * sumX || 1;
  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  return Array.from({ length: count }, (_, index) => {
    const periodIndex = n + index + 1;
    const prediction = Math.max(0, intercept + slope * periodIndex);
    const confidence = Math.max(62, 92 - index * 4);

    return {
      label: `${labelPrefix} ${index + 1}`,
      predictedValue: Number(prediction.toFixed(2)),
      confidence,
    };
  });
};

const getMonthlyEnergyHistory = async () =>
  EnergyConsumption.aggregate([
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m',
            date: '$recordedAt',
          },
        },
        totalKwh: {
          $sum: {
            $add: ['$electricityKwh', '$heatingKwh', '$coolingKwh'],
          },
        },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        label: '$_id',
        value: { $round: ['$totalKwh', 2] },
      },
    },
  ]);

const getMonthlyRenewableHistory = async () =>
  RenewableEnergy.aggregate([
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m',
            date: '$recordedAt',
          },
        },
        totalMwh: {
          $sum: {
            $add: ['$solarMwh', '$windMwh', '$hydroMwh', '$nuclearMwh'],
          },
        },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        label: '$_id',
        value: { $round: ['$totalMwh', 2] },
      },
    },
  ]);

const getMonthlyEmissionsHistory = async () =>
  CO2Emission.aggregate([
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m',
            date: '$recordedAt',
          },
        },
        totalTonnes: { $sum: '$totalTonnes' },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        label: '$_id',
        value: { $round: ['$totalTonnes', 2] },
      },
    },
  ]);

const getPredictions = async () => {
  const [energyHistory, renewableHistory, emissionsHistory] = await Promise.all([
    getMonthlyEnergyHistory(),
    getMonthlyRenewableHistory(),
    getMonthlyEmissionsHistory(),
  ]);

  return {
    energyDemand: {
      historical: energyHistory,
      forecast: linearRegressionForecast(
        energyHistory.map((entry) => entry.value),
        6,
        'Month'
      ),
    },
    renewableGrowth: {
      historical: renewableHistory,
      forecast: linearRegressionForecast(
        renewableHistory.map((entry) => entry.value),
        6,
        'Month'
      ),
    },
    co2Trend: {
      historical: emissionsHistory,
      forecast: linearRegressionForecast(
        emissionsHistory.map((entry) => entry.value),
        6,
        'Month'
      ),
    },
  };
};

export { getPredictions };
