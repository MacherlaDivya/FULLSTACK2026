import mongoose from 'mongoose';

const co2EmissionSchema = new mongoose.Schema(
  {
    recordedAt: {
      type: Date,
      required: true,
      unique: true,
      index: true,
    },
    totalTonnes: {
      type: Number,
      required: true,
    },
    buildingOperationsTonnes: {
      type: Number,
      required: true,
    },
    gridTonnes: {
      type: Number,
      required: true,
    },
    heatingTonnes: {
      type: Number,
      required: true,
    },
    transportProxyTonnes: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CO2Emission = mongoose.model('CO2Emission', co2EmissionSchema);

export default CO2Emission;
