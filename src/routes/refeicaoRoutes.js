const refeicaoController = require('../controllers/refeicaoController');
const { verificarToken } = require('../middlewares/auth');

async function routes(fastify, options) {
  fastify.get('/refeicoes', {
    preHandler: [verificarToken],
    schema: {
      querystring: {
        type: 'object',
        required: ['dataInicio', 'dataFim'],
        properties: {
          dataInicio: { type: 'string', format: 'date' },
          dataFim: { type: 'string', format: 'date' }
        }
      }
    }
  }, refeicaoController.buscarRefeicoes);

  fastify.get('/refeicoes/relatorio', {
    preHandler: [verificarToken],
    schema: {
      querystring: {
        type: 'object',
        required: ['dataInicio', 'dataFim'],
        properties: {
          dataInicio: { type: 'string', format: 'date' },
          dataFim: { type: 'string', format: 'date' }
        }
      }
    }
  }, refeicaoController.gerarRelatorio);
}