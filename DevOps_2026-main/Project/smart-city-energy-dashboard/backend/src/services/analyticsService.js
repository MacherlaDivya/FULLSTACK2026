import mongoose from 'mongoose';

import Building from '../models/Building.js';
import CO2Emission from '../models/CO2Emission.js';
import EnergyConsumption from '../models/EnergyConsumption.js';
import RenewableEnergy from '../models/RenewableEnergy.js';

const buildDateRange = ({ year, month, startDate, endDate } = {}) => {
  const match = {};

  if (year) {
    const start = new Date(Number(year), month ? Number(month) - 1 : 0, 1);
    const end = month
      ? new Date(Number(year), Number(month), 0, 23, 59, 59, 999)
      : new Date(Number(year), 11, 31, 23, 59, 59, 999);
    match.$gte = start;
    match.$lte = end;
  }

  if (startDate) {
    match.$gte = new Date(startDate);
  }

  if (endDate) {
    match.$lte = new Date(endDate);
  }

  return Object.keys(match).length ? match : undefined;
};

const getGroupFormat = (granularity = 'daily') => {
  if (granularity === 'yearly') {
    return '%Y';
  }

  if (granularity === 'monthly') {
    return '%Y-%m';
  }

  return '%Y-%m-%d';
};

const normalizeDateInput = (query) => {
  const dateRange = buildDateRange(query);
  return dateRange ? { recordedAt: dateRange } : {};
};

const getEnergySeries = async ({ granularity = 'daily', buildingId, ...filters } = {}) => {
  const match = normalizeDateInput(filters);

  if (buildingId) {
    match.building = new mongoose.Types.ObjectId(buildingId);
  }

  return EnergyConsumption.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          $dateToString: {
            format: getGroupFormat(granularity),
            date: '$recordedAt',
          },
        },
        electricityKwh: { $sum: '$electricityKwh' },
        heatingKwh: { $sum: '$heatingKwh' },
        coolingKwh: { $sum: '$coolingKwh' },
        totalKwh: {
          $sum: {
            $add: ['$electricityKwh', '$heatingKwh', '$coolingKwh'],
          },
        },
        peakDemandKw: { $avg: '$peakDemandKw' },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        label: '$_id',
        electricityKwh: { $round: ['$electricityKwh', 2] },
        heatingKwh: { $round: ['$heatingKwh', 2] },
        coolingKwh: { $round: ['$coolingKwh', 2] },
        totalKwh: { $round: ['$totalKwh', 2] },
        peakDemandKw: { $round: ['$peakDemandKw', 2] },
      },
    },
  ]);
};

const getSeasonalDemand = async (filters = {}) => {
  const match = normalizeDateInput(filters);

  return EnergyConsumption.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$season',
        totalKwh: {
          $sum: {
            $add: ['$electricityKwh', '$heatingKwh', '$coolingKwh'],
          },
        },
        peakDemandKw: { $avg: '$peakDemandKw' },
      },
    },
    {
      $project: {
        _id: 0,
        season: '$_id',
        totalKwh: { $round: ['$totalKwh', 2] },
        peakDemandKw: { $round: ['$peakDemandKw', 2] },
      },
    },
  ]);
};

const getBuildingConsumptionBreakdown = async (filters = {}) => {
  const match = normalizeDateInput(filters);

  return EnergyConsumption.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$building',
        totalKwh: {
          $sum: {
            $add: ['$electricityKwh', '$heatingKwh', '$coolingKwh'],
          },
        },
        peakDemandKw: { $avg: '$peakDemandKw' },
      },
    },
    {
      $lookup: {
        from: 'buildings',
        localField: '_id',
        foreignField: '_id',
        as: 'building',
      },
    },
    { $unwind: '$building' },
    { $sort: { totalKwh: -1 } },
    { $limit: 10 },
    {
      $project: {
        _id: 0,
        id: '$building._id',
        name: '$building.name',
        type: '$building.type',
        district: '$building.district',
        totalKwh: { $round: ['$totalKwh', 2] },
        peakDemandKw: { $round: ['$peakDemandKw', 2] },
      },
    },
  ]);
};

const getDashboardSummary = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalBuildings,
    energyTotals,
    renewableTotals,
    co2Totals,
    energyTrend,
    buildingTypes,
    alerts,
  ] = await Promise.all([
    Building.countDocuments({ isActive: true }),
    EnergyConsumption.aggregate([
      { $match: { recordedAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: null,
          totalEnergyKwh: {
            $sum: {
              $add: ['$electricityKwh', '$heatingKwh', '$coolingKwh'],
            },
          },
          fuelBasedElectricityUsageKwh: {
            $sum: {
              $add: ['$sourceMix.gridKwh', '$sourceMix.naturalGasKwh'],
            },
          },
        },
      },
    ]),
    RenewableEnergy.aggregate([
      { $match: { recordedAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: null,
          solarMwh: { $sum: '$solarMwh' },
          windMwh: { $sum: '$windMwh' },
          hydroMwh: { $sum: '$hydroMwh' },
          nuclearMwh: { $sum: '$nuclearMwh' },
          nonRenewableMwh: { $sum: '$nonRenewableMwh' },
        },
      },
    ]),
    CO2Emission.aggregate([
      { $match: { recordedAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: null,
          totalTonnes: { $sum: '$totalTonnes' },
          buildingOperationsTonnes: { $sum: '$buildingOperationsTonnes' },
          gridTonnes: { $sum: '$gridTonnes' },
          heatingTonnes: { $sum: '$heatingTonnes' },
          transportProxyTonnes: { $sum: '$transportProxyTonnes' },
        },
      },
    ]),
    getEnergySeries({ granularity: 'daily', startDate: thirtyDaysAgo.toISOString() }),
    Building.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          type: '$_id',
          count: 1,
        },
      },
    ]),
    EnergyConsumption.aggregate([
      {
        $match: {
          recordedAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: '$building',
          totalKwh: {
            $sum: {
              $add: ['$electricityKwh', '$heatingKwh', '$coolingKwh'],
            },
          },
        },
      },
      { $sort: { totalKwh: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: 'buildings',
          localField: '_id',
          foreignField: '_id',
          as: 'building',
        },
      },
      { $unwind: '$building' },
      {
        $project: {
          _id: 0,
          buildingName: '$building.name',
          buildingType: '$building.type',
          totalKwh: { $round: ['$totalKwh', 2] },
          level: {
            $cond: [{ $gte: ['$totalKwh', 190000] }, 'critical', 'warning'],
          },
        },
      },
    ]),
  ]);

  const energy = energyTotals[0] || { totalEnergyKwh: 0, fuelBasedElectricityUsageKwh: 0 };
  const renewable = renewableTotals[0] || {
    solarMwh: 0,
    windMwh: 0,
    hydroMwh: 0,
    nuclearMwh: 0,
    nonRenewableMwh: 0,
  };
  const co2 = co2Totals[0] || {
    totalTonnes: 0,
    buildingOperationsTonnes: 0,
    gridTonnes: 0,
    heatingTonnes: 0,
    transportProxyTonnes: 0,
  };

  const renewableTotal = renewable.solarMwh + renewable.windMwh + renewable.hydroMwh + renewable.nuclearMwh;
  const renewablePercentage = renewableTotal + renewable.nonRenewableMwh === 0
    ? 0
    : (renewableTotal / (renewableTotal + renewable.nonRenewableMwh)) * 100;

  return {
    cards: {
      totalCityEnergyConsumptionKwh: Number(energy.totalEnergyKwh.toFixed(2)),
      renewableGenerationMwh: Number(renewableTotal.toFixed(2)),
      co2EmissionsTonnes: Number(co2.totalTonnes.toFixed(2)),
      totalBuildingsMonitored: totalBuildings,
      renewableEnergyPercentage: Number(renewablePercentage.toFixed(2)),
      fuelBasedElectricityUsageKwh: Number(energy.fuelBasedElectricityUsageKwh.toFixed(2)),
    },
    renewableMix: [
      { label: 'Solar', value: renewable.solarMwh },
      { label: 'Wind', value: renewable.windMwh },
      { label: 'Hydro', value: renewable.hydroMwh },
      { label: 'Nuclear', value: renewable.nuclearMwh },
      { label: 'Non-Renewable', value: renewable.nonRenewableMwh },
    ],
    co2Breakdown: [
      { label: 'Building Operations', value: co2.buildingOperationsTonnes },
      { label: 'Grid', value: co2.gridTonnes },
      { label: 'Heating', value: co2.heatingTonnes },
      { label: 'Transport Proxy', value: co2.transportProxyTonnes },
    ],
    buildingTypes,
    energyTrend,
    alerts,
  };
};

const getRenewableAnalytics = async ({ granularity = 'monthly', ...filters } = {}) => {
  const match = normalizeDateInput(filters);

  const [series, totals] = await Promise.all([
    RenewableEnergy.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            $dateToString: {
              format: getGroupFormat(granularity),
              date: '$recordedAt',
            },
          },
          solarMwh: { $sum: '$solarMwh' },
          windMwh: { $sum: '$windMwh' },
          hydroMwh: { $sum: '$hydroMwh' },
          nuclearMwh: { $sum: '$nuclearMwh' },
          nonRenewableMwh: { $sum: '$nonRenewableMwh' },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          label: '$_id',
          solarMwh: { $round: ['$solarMwh', 2] },
          windMwh: { $round: ['$windMwh', 2] },
          hydroMwh: { $round: ['$hydroMwh', 2] },
          nuclearMwh: { $round: ['$nuclearMwh', 2] },
          nonRenewableMwh: { $round: ['$nonRenewableMwh', 2] },
        },
      },
    ]),
    RenewableEnergy.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          solarMwh: { $sum: '$solarMwh' },
          windMwh: { $sum: '$windMwh' },
          hydroMwh: { $sum: '$hydroMwh' },
          nuclearMwh: { $sum: '$nuclearMwh' },
          nonRenewableMwh: { $sum: '$nonRenewableMwh' },
        },
      },
    ]),
  ]);

  const summary = totals[0] || {
    solarMwh: 0,
    windMwh: 0,
    hydroMwh: 0,
    nuclearMwh: 0,
    nonRenewableMwh: 0,
  };
  const renewableTotal = summary.solarMwh + summary.windMwh + summary.hydroMwh + summary.nuclearMwh;
  const contributionPercentage = renewableTotal + summary.nonRenewableMwh === 0
    ? 0
    : (renewableTotal / (renewableTotal + summary.nonRenewableMwh)) * 100;

  return {
    summary: {
      ...summary,
      renewableTotal: Number(renewableTotal.toFixed(2)),
      contributionPercentage: Number(contributionPercentage.toFixed(2)),
    },
    comparison: [
      { name: 'Renewable + Nuclear', value: Number(renewableTotal.toFixed(2)) },
      { name: 'Non-Renewable', value: Number(summary.nonRenewableMwh.toFixed(2)) },
    ],
    series,
  };
};

const getCO2Analytics = async ({ granularity = 'monthly', ...filters } = {}) => {
  const match = normalizeDateInput(filters);

  const [series, totals] = await Promise.all([
    CO2Emission.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            $dateToString: {
              format: getGroupFormat(granularity),
              date: '$recordedAt',
            },
          },
          totalTonnes: { $sum: '$totalTonnes' },
          buildingOperationsTonnes: { $sum: '$buildingOperationsTonnes' },
          gridTonnes: { $sum: '$gridTonnes' },
          heatingTonnes: { $sum: '$heatingTonnes' },
          transportProxyTonnes: { $sum: '$transportProxyTonnes' },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          label: '$_id',
          totalTonnes: { $round: ['$totalTonnes', 2] },
          buildingOperationsTonnes: { $round: ['$buildingOperationsTonnes', 2] },
          gridTonnes: { $round: ['$gridTonnes', 2] },
          heatingTonnes: { $round: ['$heatingTonnes', 2] },
          transportProxyTonnes: { $round: ['$transportProxyTonnes', 2] },
        },
      },
    ]),
    CO2Emission.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalTonnes: { $sum: '$totalTonnes' },
          buildingOperationsTonnes: { $sum: '$buildingOperationsTonnes' },
          gridTonnes: { $sum: '$gridTonnes' },
          heatingTonnes: { $sum: '$heatingTonnes' },
          transportProxyTonnes: { $sum: '$transportProxyTonnes' },
        },
      },
    ]),
  ]);

  return {
    summary: totals[0] || {
      totalTonnes: 0,
      buildingOperationsTonnes: 0,
      gridTonnes: 0,
      heatingTonnes: 0,
      transportProxyTonnes: 0,
    },
    series,
  };
};

const getCityDemandAnalysis = async (filters = {}) => {
  const match = normalizeDateInput(filters);

  const [demandByBuildingType, densityAnalysis] = await Promise.all([
    EnergyConsumption.aggregate([
      { $match: match },
      {
        $lookup: {
          from: 'buildings',
          localField: 'building',
          foreignField: '_id',
          as: 'building',
        },
      },
      { $unwind: '$building' },
      {
        $group: {
          _id: '$building.type',
          totalKwh: {
            $sum: {
              $add: ['$electricityKwh', '$heatingKwh', '$coolingKwh'],
            },
          },
          averagePeakDemandKw: { $avg: '$peakDemandKw' },
        },
      },
      {
        $project: {
          _id: 0,
          type: '$_id',
          totalKwh: { $round: ['$totalKwh', 2] },
          averagePeakDemandKw: { $round: ['$averagePeakDemandKw', 2] },
        },
      },
    ]),
    EnergyConsumption.aggregate([
      { $match: match },
      {
        $lookup: {
          from: 'buildings',
          localField: 'building',
          foreignField: '_id',
          as: 'building',
        },
      },
      { $unwind: '$building' },
      {
        $project: {
          totalKwh: {
            $add: ['$electricityKwh', '$heatingKwh', '$coolingKwh'],
          },
          densityBucket: {
            $switch: {
              branches: [
                { case: { $lte: ['$building.populationDensityIndex', 4] }, then: 'Low Density' },
                { case: { $lte: ['$building.populationDensityIndex', 7] }, then: 'Medium Density' },
              ],
              default: 'High Density',
            },
          },
        },
      },
      {
        $group: {
          _id: '$densityBucket',
          totalKwh: { $sum: '$totalKwh' },
          averageKwh: { $avg: '$totalKwh' },
        },
      },
      {
        $project: {
          _id: 0,
          densityBucket: '$_id',
          totalKwh: { $round: ['$totalKwh', 2] },
          averageKwh: { $round: ['$averageKwh', 2] },
        },
      },
    ]),
  ]);

  return {
    demandByBuildingType,
    densityAnalysis,
  };
};

export {
  getBuildingConsumptionBreakdown,
  getCityDemandAnalysis,
  getCO2Analytics,
  getDashboardSummary,
  getEnergySeries,
  getRenewableAnalytics,
  getSeasonalDemand,
};
