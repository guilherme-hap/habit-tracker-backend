import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import { sequelize } from './models/index.js';
import authRoutes from './routes/auth/auth.js';
import habitRoutes from './routes/habits.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api/habits', habitRoutes); 

const PORT = process.env.PORT || 3001;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
});
