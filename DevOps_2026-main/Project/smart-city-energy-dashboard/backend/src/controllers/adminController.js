import asyncHandler from '../utils/asyncHandler.js';
import Building from '../models/Building.js';
import ContactMessage from '../models/ContactMessage.js';
import EnergyConsumption from '../models/EnergyConsumption.js';
import RenewableEnergy from '../models/RenewableEnergy.js';
import User from '../models/User.js';

const getUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 }).lean();

  res.json({
    success: true,
    data: users,
  });
});

const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: req.body.role },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  res.json({
    success: true,
    data: user,
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  res.json({
    success: true,
    message: 'User deleted successfully',
  });
});

const getAdminOverview = asyncHandler(async (_req, res) => {
  const [users, buildings, energyRecords, renewableRecords, contactMessages] = await Promise.all([
    User.countDocuments(),
    Building.countDocuments(),
    EnergyConsumption.countDocuments(),
    RenewableEnergy.countDocuments(),
    ContactMessage.countDocuments(),
  ]);

  res.json({
    success: true,
    data: {
      users,
      buildings,
      energyRecords,
      renewableRecords,
      contactMessages,
    },
  });
});

export { deleteUser, getAdminOverview, getUsers, updateUserRole };
