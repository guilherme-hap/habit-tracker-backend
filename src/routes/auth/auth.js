import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../../models/index.js';

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/register', async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({
            error: 'Email, senha e nome são obrigatórios',
        });
    }

    try {
        const user = await User.create({
            email,
            password,
            name,
        });

        res.json({
            message: 'Usuário criado com sucesso',
            userId: user.id,
        });
    } catch (err) {
        console.error('Erro ao criar usuário:', err);
        res.status(400).json({
            error: 'Usuário já existe ou dados inválidos',
        });
    }
});

router.post('/login', async (req, res) => {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: 'Email e senha são obrigatórios',
        });
    }

    try {
        const user = await User.findOne({
            where: { email },
        });

        if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: rememberMe ? '30d' : process.env.JWT_EXPIRES_IN || '12h',
        });

        res.json({
            token,
            userId: user.id,
            name: user.name,
            avatar: user.avatar,
        });
    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).json({ error: 'Erro interno ao realizar login' });
    }
});

router.post('/google', async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json(
            { error: 'Token do Google não fornecido' }
        );
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        let user = await User.findOne({ where: { email } });

        if (!user) {
            user = await User.create({
                email,
                name,
                avatar: picture,
                provider: 'google',
            });
        }

        const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        });

        res.json({ token: jwtToken, userId: user.id, name: user.name, avatar: user.avatar });
    } catch (err) {
        console.error('Erro no login com Google:', err.message);
        res.status(401).json(
            { error: 'Token Google inválido' }
        );
    }
});

export default router;