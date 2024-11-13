const jwt = require('jsonwebtoken');

function verificarPermissao(role) {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: 'Token não fornecido' });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userData = decoded;

      // Verificação de função do usuário
      if (role && decoded.role !== role && decoded.role !== 'admin') {
        return res.status(403).json({ message: 'Acesso negado: Permissão insuficiente' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Autenticação falhou' });
    }
  };
}

module.exports = verificarPermissao;
