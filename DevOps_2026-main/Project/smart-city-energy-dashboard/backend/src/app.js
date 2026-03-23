import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import buildingRoutes from './routes/buildingRoutes.js';
import co2Routes from './routes/co2Routes.js';
import contactRoutes from './routes/contactRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import energyRoutes from './routes/energyRoutes.js';
import predictionRoutes from './routes/predictionRoutes.js';
import renewableRoutes from './routes/renewableRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Smart City Energy Management Dashboard API is healthy',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/buildings', buildingRoutes);
app.use('/api/energy-consumption', energyRoutes);
app.use('/api/renewable-energy', renewableRoutes);
app.use('/api/co2-emissions', co2Routes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
