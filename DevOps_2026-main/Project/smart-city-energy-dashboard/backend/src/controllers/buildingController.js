import asyncHandler from '../utils/asyncHandler.js';
import Building from '../models/Building.js';
import EnergyConsumption from '../models/EnergyConsumption.js';

const getBuildings = asyncHandler(async (req, res) => {
  const { search, type, district, minConsumption, maxConsumption } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { code: { $regex: search, $options: 'i' } },
      { district: { $regex: search, $options: 'i' } },
    ];
  }

  if (type) {
    query.type = type;
  }

  if (district) {
    query.district = district;
  }

  const buildings = await Building.find(query).sort({ name: 1 }).lean();

  const consumption = await EnergyConsumption.aggregate([
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
  ]);

  const consumptionMap = new Map(consumption.map((entry) => [String(entry._id), entry.totalKwh]));
  const minValue = minConsumption ? Number(minConsumption) : null;
  const maxValue = maxConsumption ? Number(maxConsumption) : null;

  const enriched = buildings
    .map((building) => ({
      ...building,
      totalConsumptionKwh: Number((consumptionMap.get(String(building._id)) || 0).toFixed(2)),
    }))
    .filter((building) => {
      if (minValue !== null && building.totalConsumptionKwh < minValue) {
        return false;
      }

      if (maxValue !== null && building.totalConsumptionKwh > maxValue) {
        return false;
      }

      return true;
    });

  res.json({
    success: true,
    data: enriched,
  });
});

const getBuildingById = asyncHandler(async (req, res) => {
  const building = await Building.findById(req.params.id);

  if (!building) {
    const error = new Error('Building not found');
    error.statusCode = 404;
    throw error;
  }

  res.json({
    success: true,
    data: building,
  });
});

const createBuilding = asyncHandler(async (req, res) => {
  const building = await Building.create(req.body);

  res.status(201).json({
    success: true,
    data: building,
  });
});

const updateBuilding = asyncHandler(async (req, res) => {
  const building = await Building.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!building) {
    const error = new Error('Building not found');
    error.statusCode = 404;
    throw error;
  }

  res.json({
    success: true,
    data: building,
  });
});

const deleteBuilding = asyncHandler(async (req, res) => {
  const building = await Building.findByIdAndDelete(req.params.id);

  if (!building) {
    const error = new Error('Building not found');
    error.statusCode = 404;
    throw error;
  }

  await EnergyConsumption.deleteMany({ building: building._id });

  res.json({
    success: true,
    message: 'Building deleted successfully',
  });
});

export {
  createBuilding,
  deleteBuilding,
  getBuildingById,
  getBuildings,
  updateBuilding,
};
