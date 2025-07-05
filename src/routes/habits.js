import express from 'express';
import { Tag, Habit, HabitCompletion } from '../models/index.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
    try {
        const { name, description, frequency, tags = [] } = req.body;

        const habit = await Habit.create({
            name,
            description,
            frequency,
            userId: req.user.userId,
        });

        if (Array.isArray(tags) && tags.every((t) => typeof t === 'string')) {
            const tagInstances = await Tag.findAll({
                where: {
                    name: tags,
                    userId: req.user.userId,
                },
            });

            await habit.setTags(tagInstances);
        }

        res.status(201).json({
            message: 'Hábito criado com sucesso',
            habit,
        });
    } catch (err) {
        console.error('Erro ao criar hábito:', err);
        res.status(500).json({ error: 'Erro ao criar hábito' });
    }
});

router.get('/all', verifyToken, async (req, res) => {
    try {
      const habits = await Habit.findAll({
        where: { userId: req.user.userId },
        include: [
          { model: Tag, as: 'tags', through: { attributes: [] } },
          { model: HabitCompletion, as: 'completions', attributes: ['date'] },
        ],
      });
      const habitsWithConcludedDays = habits.map(habit => {
        const concludedDays = habit.completions?.map(c => c.date) || [];
        return {
          ...habit.toJSON(),
          concludedDays,
        };
      });
  
      res.status(200).json(habitsWithConcludedDays);
    } catch (error) {
      console.error('Erro ao buscar hábitos:', error);
      res.status(500).json({ error: error.message, stack: error.stack });
    }
  });
  

router.put('/update/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { name, description, frequency, tags = [] } = req.body;

    try {
        const habit = await Habit.findOne({
            where: {
                id,
                userId: req.user.userId,
            },
        });

        if (!habit) {
            return res.status(404).json({ error: 'Hábito não encontrado' });
        }

        habit.name = name ?? habit.name;
        habit.description = description ?? habit.description;
        habit.frequency = frequency ?? habit.frequency;
        await habit.save();

        if (Array.isArray(tags) && tags.every((t) => typeof t === 'string')) {
            const tagInstances = await Tag.findAll({
                where: {
                    name: tags,
                    userId: req.user.userId,
                },
            });

            await habit.setTags(tagInstances);
        }

        res.json({
            message: 'Hábito atualizado com sucesso',
            habit,
        });
    } catch (err) {
        console.error('Erro ao atualizar hábito:', err);
        res.status(500).json({ error: 'Erro ao atualizar hábito' });
    }
});

router.delete('/delete/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        const habit = await Habit.findOne({
            where: {
                id,
                userId: req.user.userId,
            },
        });

        if (!habit) {
            return res.status(404).json({
                error: 'Hábito não encontrado',
            });
        }

        await habit.destroy();
        res.json({
            message: 'Hábito deletado com sucesso',
        });
    } catch (err) {
        console.error('Erro ao deletar hábito:', err);
        res.status(500).json({
            error: 'Erro ao deletar hábito.',
        });
    }
});

router.post('/:id/complete', verifyToken, async (req, res) => {
    const habitId = Number(req.params.id);
    const userId = req.user.userId;
    const rawDate = req.body.date ? new Date(req.body.date) : new Date();
    const isoDate = rawDate.toISOString().split('T')[0];

    try {
        const existing = await HabitCompletion.findOne({
            where: {
                habitId,
                userId,
                date: isoDate,
            },
        });

        if (existing) {
            await existing.destroy();
            return res.status(200).json({
                message: 'Hábito desmarcado com sucesso',
            });
        } else {
            const completion = await HabitCompletion.create({
                habitId,
                userId,
                date: isoDate,
            });
            return res.status(201).json({
                message: 'Hábito marcado como concluído',
                completion,
            });
        }
    } catch (err) {
        console.error('Erro ao alternar conclusão do hábito:', err);
        return res.status(500).json({
            error: 'Erro ao atualizar conclusão do hábito',
        });
    }
});

router.get('/:id/history', verifyToken, async (req, res) => {
    const habitId = req.params.id;
    const userId = req.user.userId;

    try {
        const history = await HabitCompletion.findAll({
            where: { habitId, userId },
            order: [['date', 'DESC']],
        });

        const formattedHistory = history.map((entry) => ({
            id: entry.id,
            habitId: entry.habitId,
            userId: entry.userId,
            date: new Date(entry.date).toLocaleDateString('pt-BR'),
        }));

        res.status(200).json(formattedHistory);
    } catch (err) {
        console.error('Erro ao buscar histórico:', err);
        res.status(500).json({
            error: 'Erro ao buscar histórico',
        });
    }
});

export default router;
