const usuarioController = require('../controllers/usuarioController');
const { verificarToken } = require('../middlewares/auth');

async function routes(fastify, options) {
  fastify.post('/usuarios', {
    schema: {
      body: {
        type: 'object',
        required: ['nome', 'matricula', 'email', 'senha'],
        properties: {
          nome: { type: 'string' },
          matricula: { type: 'string' },
          email: { type: 'string', format: 'email' },
          senha: { type: 'string', minLength: 6 },
          fotoUsuario: { type: 'string', format: 'binary' }
        }
      }
    }
  }, usuarioController.criar);

  fastify.get('/usuarios/:matricula', {
    preHandler: [verificarToken]
  }, usuarioController.buscarPorMatricula);

  fastify.put('/usuarios/:matricula/saldo', {
    preHandler: [verificarToken],
    schema: {
      body: {
        type: 'object',
        required: ['valor'],
        properties: {
          valor: { type: 'number' }
        }
      }
    }
  }, usuarioController.atualizarSaldo);
}

module.exports = routes;
