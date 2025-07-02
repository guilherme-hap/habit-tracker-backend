import express from 'express';
import { Tag } from '../models/index.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
    try {
        const tags = await Tag.findAll({
            where: { userId: req.user.userId },
            order: [['name', 'ASC']],
        });
        res.json(tags);
    } catch (err) {
        console.error('Erro ao buscar tags:', err);
        res.status(500).json({ error: 'Erro ao buscar tags.' });
    }
});

router.post('/', verifyToken, async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Nome da tag é obrigatório.' });
    }

    try {
        const tag = await Tag.create({
            name,
            userId: req.user.userId,
        });

        res.status(201).json({
            message: 'Tag criada com sucesso.',
            tag,
        });
    } catch (err) {
        console.error('Erro ao criar tag:', err);
        res.status(500).json({ error: 'Erro ao criar tag.' });
    }
});

export default router;
