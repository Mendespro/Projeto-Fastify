const refeicaoController = require('../controllers/refeicaoController');
const { verificarToken, verificarAdmin } = require('../middlewares/auth');

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

  // Rota de relatório de refeições (somente administrador)
  fastify.get('/refeicoes/relatorio', {
    preHandler: [verificarToken, verificarAdmin],
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

module.exports = routes;
