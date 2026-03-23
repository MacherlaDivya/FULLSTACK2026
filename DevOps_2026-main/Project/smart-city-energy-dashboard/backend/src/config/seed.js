import Building from '../models/Building.js';
import CO2Emission from '../models/CO2Emission.js';
import EnergyConsumption from '../models/EnergyConsumption.js';
import RenewableEnergy from '../models/RenewableEnergy.js';
import User from '../models/User.js';

const buildingTemplates = [
  ['Harbor Residences', 'BLD-101', 'residential', 'Harbor District', 18000, 820, 8],
  ['North Point Towers', 'BLD-102', 'residential', 'North Point', 14500, 640, 7],
  ['Central Commerce Hub', 'BLD-201', 'commercial', 'Central Business', 22000, 1500, 9],
  ['Innovation Plaza', 'BLD-202', 'commercial', 'Innovation Park', 17500, 920, 8],
  ['Riverfront Manufacturing', 'BLD-301', 'industrial', 'Riverfront', 31000, 420, 5],
  ['Metro Fabrication Works', 'BLD-302', 'industrial', 'South Works', 35500, 380, 4],
  ['Civic Services Complex', 'BLD-401', 'public', 'Civic Quarter', 12800, 540, 6],
  ['Greenline Hospital', 'BLD-402', 'public', 'Health District', 19600, 780, 7],
  ['East Market Lofts', 'BLD-103', 'residential', 'East Market', 16000, 700, 8],
  ['Skybridge Offices', 'BLD-203', 'commercial', 'Midtown', 20400, 1120, 9],
  ['Solaris Assembly Plant', 'BLD-303', 'industrial', 'Solar Belt', 33800, 360, 4],
  ['Urban Learning Center', 'BLD-403', 'public', 'University Zone', 15400, 680, 7],
];

const getSeason = (month) => {
  if ([11, 0, 1].includes(month)) return 'winter';
  if ([2, 3, 4].includes(month)) return 'spring';
  if ([5, 6, 7].includes(month)) return 'summer';
  return 'autumn';
};

const round = (value) => Math.round(value * 100) / 100;

const seedDatabase = async () => {
  const existingUsers = await User.countDocuments();
  if (existingUsers === 0) {
    await User.create([
      {
        name: 'City Admin',
        email: 'admin@smartcity.com',
        password: 'Admin@123',
        role: 'admin',
      },
      {
        name: 'Urban Analyst',
        email: 'user@smartcity.com',
        password: 'User@123',
        role: 'user',
      },
    ]);
  }

  const existingBuildings = await Building.countDocuments();
  if (existingBuildings === 0) {
    await Building.insertMany(
      buildingTemplates.map(([name, code, type, district, areaSqm, occupancy, populationDensityIndex]) => ({
        name,
        code,
        type,
        district,
        areaSqm,
        occupancy,
        populationDensityIndex,
      }))
    );
  }

  const buildings = await Building.find().lean();
  const existingEnergy = await EnergyConsumption.countDocuments();
  const existingRenewables = await RenewableEnergy.countDocuments();
  const existingEmissions = await CO2Emission.countDocuments();

  if (existingEnergy > 0 && existingRenewables > 0 && existingEmissions > 0) {
    return;
  }

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 179);
  startDate.setHours(0, 0, 0, 0);

  const energyDocs = [];
  const renewableDocs = [];
  const co2Docs = [];

  for (let dayIndex = 0; dayIndex < 180; dayIndex += 1) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + dayIndex);
    const month = currentDate.getMonth();
    const season = getSeason(month);
    const seasonalFactor = season === 'winter' ? 1.28 : season === 'summer' ? 1.14 : 1;
    const renewableWeatherFactor = season === 'summer' ? 1.18 : season === 'winter' ? 0.94 : 1.04;

    let cityElectricity = 0;
    let cityHeating = 0;
    let cityCooling = 0;
    let cityPeak = 0;
    let fuelBasedKwh = 0;

    buildings.forEach((building, buildingIndex) => {
      const typeFactor =
        building.type === 'industrial' ? 1.6 : building.type === 'commercial' ? 1.28 : building.type === 'public' ? 1.12 : 1;
      const usageWave = 1 + Math.sin((dayIndex + buildingIndex * 7) / 9) * 0.08;
      const occupancyRate = Math.min(0.98, 0.58 + (building.populationDensityIndex / 16) + ((dayIndex + buildingIndex) % 6) * 0.025);
      const electricityKwh = round((building.areaSqm * 0.16 + building.occupancy * 2.5) * typeFactor * seasonalFactor * usageWave);
      const heatingKwh = round(electricityKwh * (season === 'winter' ? 0.44 : season === 'autumn' ? 0.23 : 0.12));
      const coolingKwh = round(electricityKwh * (season === 'summer' ? 0.31 : season === 'spring' ? 0.17 : 0.1));
      const peakDemandKw = round((electricityKwh / 24) * (1.12 + building.populationDensityIndex * 0.02));
      const renewableKwh = round(electricityKwh * (0.22 + renewableWeatherFactor * 0.06));
      const nuclearKwh = round(electricityKwh * 0.17);
      const naturalGasKwh = round(heatingKwh * 0.62);
      const gridKwh = round(Math.max(0, electricityKwh + heatingKwh + coolingKwh - renewableKwh - nuclearKwh - naturalGasKwh));

      cityElectricity += electricityKwh;
      cityHeating += heatingKwh;
      cityCooling += coolingKwh;
      cityPeak += peakDemandKw;
      fuelBasedKwh += naturalGasKwh + gridKwh;

      energyDocs.push({
        building: building._id,
        recordedAt: currentDate,
        season,
        electricityKwh,
        heatingKwh,
        coolingKwh,
        peakDemandKw,
        occupancyRate: round(occupancyRate),
        sourceMix: {
          gridKwh,
          naturalGasKwh,
          renewableKwh,
          nuclearKwh,
        },
      });
    });

    const solarMwh = round(cityElectricity / 1000 * (0.2 * renewableWeatherFactor));
    const windMwh = round(cityElectricity / 1000 * (0.15 + Math.cos(dayIndex / 12) * 0.025));
    const hydroMwh = round(cityElectricity / 1000 * 0.11);
    const nuclearMwh = round(cityElectricity / 1000 * 0.18);
    const nonRenewableMwh = round(fuelBasedKwh / 1000);

    renewableDocs.push({
      recordedAt: currentDate,
      solarMwh,
      windMwh,
      hydroMwh,
      nuclearMwh,
      nonRenewableMwh,
    });

    const totalTonnes = round((cityElectricity + cityHeating + cityCooling) * 0.00038 + fuelBasedKwh * 0.00014);
    co2Docs.push({
      recordedAt: currentDate,
      totalTonnes,
      buildingOperationsTonnes: round(totalTonnes * 0.46),
      gridTonnes: round(totalTonnes * 0.24),
      heatingTonnes: round(totalTonnes * 0.19),
      transportProxyTonnes: round(totalTonnes * 0.11),
    });
  }

  if (existingEnergy === 0) {
    await EnergyConsumption.insertMany(energyDocs);
  }

  if (existingRenewables === 0) {
    await RenewableEnergy.insertMany(renewableDocs);
  }

  if (existingEmissions === 0) {
    await CO2Emission.insertMany(co2Docs);
  }

  console.log('Database seeded with sample smart city energy data');
};

export { seedDatabase };
