const usuarioController = require('../controllers/usuarioController');
const { verificarToken, verificarAdmin, verificarFuncionario } = require('../middlewares/auth');

async function routes(fastify, options) {
  // Rota de cadastro de usuário (funcionário)
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
      },
    },
    preHandler: [verificarToken, verificarFuncionario]
  }, usuarioController.criar);

  // Buscar usuário por matrícula
  fastify.get('/usuarios/:matricula', {
    preHandler: [verificarToken, verificarFuncionario]
  }, usuarioController.buscarPorMatricula);

  // Atualizar saldo (funcionário)
  fastify.put('/usuarios/:matricula/saldo', {
    preHandler: [verificarToken, verificarFuncionario],
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

  // Bloquear/Desbloquear Cartão (funcionário)
  fastify.put('/usuarios/:matricula/cartao/bloquear', {
    preHandler: [verificarToken, verificarFuncionario]
  }, usuarioController.bloquearDesbloquearCartao);
}

module.exports = routes;
