const cartaoController = require('../controllers/cartaoController');
const { verificarToken } = require('../middlewares/auth');

async function routes(fastify, options) {
  fastify.post('/cartoes', {
    preHandler: [verificarToken],
    schema: {
      body: {
        type: 'object',
        required: ['numeroCartao', 'matricula'],
        properties: {
          numeroCartao: { type: 'string' },
          matricula: { type: 'string' }
        }
      }
    }
  }, cartaoController.criarCartao);

  fastify.post('/cartoes/bloquear', {
    preHandler: [verificarToken],
    schema: {
      body: {
        type: 'object',
        required: ['numeroCartao'],
        properties: {
          numeroCartao: { type: 'string' },
          motivo: { type: 'string' }
        }
      }
    }
  }, cartaoController.bloquearCartao);

  fastify.get('/cartoes/:numeroCartao', {
    preHandler: [verificarToken]
  }, cartaoController.buscarCartaoPorNumero);
}

module.exports = routes;