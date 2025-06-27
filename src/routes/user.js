import express from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import { User } from '../models/index.js';

const router = express.Router();

router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.userId, {
            attributes: ['id', 'email', 'name', 'avatar', 'provider'],
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.json(user);
    } catch (err) {
        console.error('Erro ao buscar usuário autenticado:', err);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

export default router;
