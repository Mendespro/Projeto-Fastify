const { verify } = require('jsonwebtoken');

const verificarToken = async (request, reply) => {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new Error('Token não fornecido');
    }

    const decoded = verify(token, process.env.JWT_SECRET);
    request.usuario = decoded;

    return;
  } catch (error) {
    reply.code(401).send({
      error: 'Não autorizado'
    });
  }
};

module.exports = { verificarToken };

module.exports = {
  cartaoController,
  depositoController,
  refeicaoController,
  routes
};