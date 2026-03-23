import mongoose from 'mongoose';

const renewableEnergySchema = new mongoose.Schema(
  {
    recordedAt: {
      type: Date,
      required: true,
      unique: true,
      index: true,
    },
    solarMwh: {
      type: Number,
      required: true,
    },
    windMwh: {
      type: Number,
      required: true,
    },
    hydroMwh: {
      type: Number,
      required: true,
    },
    nuclearMwh: {
      type: Number,
      required: true,
    },
    nonRenewableMwh: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const RenewableEnergy = mongoose.model('RenewableEnergy', renewableEnergySchema);

export default RenewableEnergy;
