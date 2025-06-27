import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cron from 'node-cron';

import { sequelize } from './models/index.js';
import authRoutes from './routes/auth/auth.js';
import habitRoutes from './routes/habits.js';
import statsRoutes from './routes/stats.js';
import reportsRoutes from './routes/reports.js';
import setupStatsAggregation from './jobs/statsAggregation.js';
import userRoutes from './routes/user.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/reports', reportsRoutes(sequelize.models));
app.use('/api/user', userRoutes);

if (process.env.NODE_ENV !== 'test') {
  cron.schedule('0 2 * * *', () => {
    console.log('Running stats aggregation job...');
    setupStatsAggregation(sequelize.models);
  });
}

const PORT = process.env.PORT || 3001;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    
    if (process.env.NODE_ENV === 'development') {
      setupStatsAggregation(sequelize.models);
    }
  });
});

export default app;