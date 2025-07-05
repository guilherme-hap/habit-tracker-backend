import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js'; //
import StatsService from '../services/statsService.js';
import * as models from '../models/index.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
    const statsService = new StatsService(models);
    const userId = req.user.userId;
    const filters = req.query;

    try {
        const stats = await statsService.getUserStats(userId, req.query);
        res.json({ success: true, data: stats });
    } catch (err) {
        console.error('Erro ao obter estatísticas:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

export default router;
