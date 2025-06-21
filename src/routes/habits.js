import express from 'express';
import { Habit } from '../models/index.js';
import { HabitCompletion } from '../models/index.js';
import verifyToken from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
    try {
        const { title, frequency } = req.body;
        const habit = await Habit.create({
            title,
            frequency,
            userId: req.user.userId,
        });
        res.status(201).json({
            message: 'Hábito criado com sucesso',
            habit,
        });
    } catch (err) {
        console.error('Erro ao criar hábito:', err);
        res.status(500).json({
            error: 'Erro ao criar hábito',
        });
    }
});

router.post('/create', verifyToken, async (req, res) => {
    const { title, description, frequency } = req.body;
    const userId = req.user.userId;

    try {
        const habit = await Habit.create({
            title,
            description,
            frequency,
            userId,
        });
        res.status(201).json({
            message: 'Hábito criado com sucesso',
            habit,
        });
    } catch (err) {
        console.error('Erro ao criar hábito:', err);
        res.status(500).json({
            error: 'Erro ao criar hábito',
        });
    }
});

router.get('/all', verifyToken, async (req, res) => {
    try {
        const habits = await Habit.findAll({
            where: {
                userId: req.user.userId,
            },
        });
        res.status(200).json(habits);
    } catch (err) {
        console.error('Erro ao buscar hábitos:', err);
        res.status(500).json({
            error: 'Erro ao buscar hábitos.',
        });
    }
});

router.put('/update/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { title, description, frequency } = req.body;

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

        habit.title = title || habit.title;
        habit.description = description || habit.description;
        habit.frequency = frequency || habit.frequency;
        await habit.save();

        res.json({
            message: 'Hábito atualizado',
            habit,
        });
    } catch (err) {
        console.error('Erro ao atualizar hábito:', err);
        res.status(500).json({
            error: 'Erro ao atualizar hábito.',
        });
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
