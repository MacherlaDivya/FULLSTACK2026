import mongoose from 'mongoose';

const buildingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['residential', 'commercial', 'industrial', 'public'],
      required: true,
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    areaSqm: {
      type: Number,
      required: true,
    },
    occupancy: {
      type: Number,
      required: true,
    },
    populationDensityIndex: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    monitoredSince: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Building = mongoose.model('Building', buildingSchema);

export default Building;
