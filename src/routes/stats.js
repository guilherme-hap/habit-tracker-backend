import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js'; //
import StatsService from '../services/statsService.js';
import * as models from '../models/index.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
    const statsService = new StatsService(models);
    const userId = req.user.userId;

    try {
        const stats = await statsService.getUserStats(userId);
        res.json(stats);
    } catch (err) {
        console.error('Erro ao obter estatísticas:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

export default router;
