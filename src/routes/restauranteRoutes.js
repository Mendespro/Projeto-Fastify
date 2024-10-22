const restauranteController = require('../controllers/restauranteController');

async function routes(fastify, options) {
  // Registrar acesso e refeição
  fastify.post('/acesso', {
    schema: {
      body: {
        type: 'object',
        required: ['numeroCartao', 'tipoRefeicao'],
        properties: {
          numeroCartao: { type: 'string' },
          tipoRefeicao: { type: 'string', enum: ['ALMOCO', 'JANTAR'] }
        }
      }
    }
  }, restauranteController.registrarAcesso);

  // Realizar recarga
  fastify.post('/recarga', {
    schema: {
      body: {
        type: 'object',
        required: ['numeroCartao', 'valor'],
        properties: {
          numeroCartao: { type: 'string' },
          valor: { type: 'number', minimum: 0 }
        }
      }
    }
  }, restauranteController.realizarRecarga);

  // Bloquear cartão
  fastify.post('/cartao/bloquear', {
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
  }, restauranteController.bloquearCartao);

  // Gerar relatório
  fastify.get('/relatorio', {
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
  }, restauranteController.gerarRelatorio);
}

module.exports = routes;