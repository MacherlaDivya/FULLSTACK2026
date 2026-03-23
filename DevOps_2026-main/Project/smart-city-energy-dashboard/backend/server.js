import dotenv from 'dotenv';
import app from './src/app.js';
import connectDB from './src/config/db.js';
import { seedDatabase } from './src/config/seed.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    if (process.env.AUTO_SEED !== 'false') {
      await seedDatabase();
    }

    app.listen(PORT, () => {
      console.log(`Backend server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();
