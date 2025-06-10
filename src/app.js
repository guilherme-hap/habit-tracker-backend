import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { sequelize } from './models/index.js';
import authRoutes from './auth/auth.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3001;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
});
