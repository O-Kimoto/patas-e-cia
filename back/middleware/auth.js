const jwt = require('jsonwebtoken');

// Protege as rotas privadas: exige o header "Authorization: Bearer <token>" com um JWT válido - [Otávio Michels]
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // formato "Bearer token"

  if (!token) return res.status(401).json({ message: 'Token não fornecido. Faça login para continuar.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    // 401 também para token vencido: o front usa esse status para mandar o usuário de volta ao login - [Otávio Michels]
    if (err) return res.status(401).json({ message: 'Token inválido ou expirado. Faça login novamente.' });
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
