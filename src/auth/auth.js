import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/index.js';


const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    res.json({ message: 'Usuário criado', userId: user.id });
  } catch (err) {
    res.status(400).json({ error: 'Usuário já existe' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
  res.json({ token });
});

export default router;