const jwt = require('jsonwebtoken');

function verificarPermissao(role) {
  return async (req, reply, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return reply.code(401).send({ message: 'Token não fornecido' });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userData = decoded;

      if (role && decoded.role !== role && decoded.role !== 'ADMIN') {
        return reply.code(403).send({ message: 'Acesso negado: Permissão insuficiente' });
      }

      next();
    } catch (error) {
      return reply.code(401).send({ message: 'Autenticação falhou' });
    }
  };
}

module.exports = verificarPermissao;
