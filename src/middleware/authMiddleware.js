import jwt from 'jsonwebtoken';

export function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  console.log("🔐 Authorization header:", authHeader);

  if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' });

  const token = authHeader.split(' ')[1];
 

  if (!token) return res.status(401).json({ error: 'Token mal formatado' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token verificado:", payload);
    req.user = { userId: payload.userId };
    next();
  } catch (err) {
    console.error(" Erro ao verificar token:", err.message);
    return res.status(401).json({ error: 'Token inválido' });
  }
}
