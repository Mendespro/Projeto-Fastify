const depositoController = require('../controllers/depositoController');
const { verificarToken } = require('../middlewares/auth');

async function routes(fastify, options) {
  fastify.post('/depositos', {
    preHandler: [verificarToken],
    schema: {
      body: {
        type: 'object',
        required: ['matricula', 'valor'],
        properties: {
          matricula: { type: 'string' },
          valor: { type: 'number', minimum: 0 }
        }
      }
    }
  }, depositoController.realizarDeposito);

  fastify.get('/depositos/:matricula', {
    preHandler: [verificarToken],
    schema: {
      querystring: {
        type: 'object',
        properties: {
          dataInicio: { type: 'string', format: 'date' },
          dataFim: { type: 'string', format: 'date' }
        }
      }
    }
  }, depositoController.buscarDepositos);
}