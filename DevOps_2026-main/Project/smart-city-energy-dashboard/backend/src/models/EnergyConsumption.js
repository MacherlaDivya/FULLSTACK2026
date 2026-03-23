import mongoose from 'mongoose';

const sourceMixSchema = new mongoose.Schema(
  {
    gridKwh: { type: Number, default: 0 },
    naturalGasKwh: { type: Number, default: 0 },
    renewableKwh: { type: Number, default: 0 },
    nuclearKwh: { type: Number, default: 0 },
  },
  { _id: false }
);

const energyConsumptionSchema = new mongoose.Schema(
  {
    building: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Building',
      required: true,
    },
    recordedAt: {
      type: Date,
      required: true,
      index: true,
    },
    season: {
      type: String,
      enum: ['spring', 'summer', 'autumn', 'winter'],
      required: true,
    },
    electricityKwh: {
      type: Number,
      required: true,
    },
    heatingKwh: {
      type: Number,
      required: true,
    },
    coolingKwh: {
      type: Number,
      required: true,
    },
    peakDemandKw: {
      type: Number,
      required: true,
    },
    occupancyRate: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    sourceMix: {
      type: sourceMixSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

energyConsumptionSchema.index({ building: 1, recordedAt: 1 }, { unique: true });

const EnergyConsumption = mongoose.model('EnergyConsumption', energyConsumptionSchema);

export default EnergyConsumption;
