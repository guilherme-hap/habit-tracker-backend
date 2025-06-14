import express from 'express';
import { Habit } from '../models/index.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, frequency } = req.body;
    const habit = await Habit.create({ title, frequency, userId: req.user.userId });
    res.status(201).json(habit);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar hábito' });
  }
});

router.post('/create', verifyToken, async (req, res) => { 
  const { title, description, frequency } = req.body;
  const userId = req.user.userId;

  try {
    const habit = await Habit.create({ title, description, frequency, userId });
    res.status(201).json(habit);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar hábito' });
  }
});

router.get('/all', verifyToken, async (req, res) => {
  try {
    const habits = await Habit.findAll({
      where: { userId: req.user.userId }
    });
    res.status(200).json(habits);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar hábitos.' });
  }
});

router.put('/update/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, frequency } = req.body;

  try {
    const habit = await Habit.findOne({
      where: { id, userId: req.user.userId }
    });

    if (!habit) {
      return res.status(404).json({ error: 'Hábito não encontrado' });
    }

    habit.title = title || habit.title;
    habit.description = description || habit.description;
    habit.frequency = frequency || habit.frequency;
    await habit.save();

    res.json({ message: 'Hábito atualizado', habit });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar hábito.' });
  }
});

router.delete('/delete/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const habit = await Habit.findOne({
      where: { id, userId: req.user.userId }
    });

    if (!habit) {
      return res.status(404).json({ error: 'Hábito não encontrado' });
    }

    await habit.destroy();
    res.json({ message: 'Hábito deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar hábito.' });
  }
});

export default router;
