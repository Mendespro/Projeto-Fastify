const acessoController = require('../controllers/acessoController');

async function routes(fastify) {
  fastify.post('/acesso', {
    schema: {
      body: {
        type: 'object',
        required: ['numeroCartao', 'matricula', 'tipoRefeicao'],
        properties: {
          numeroCartao: { type: 'string' },
          matricula: { type: 'string' },
          tipoRefeicao: { type: 'string', enum: ['ALMOCO', 'JANTAR'] },
        },
      },
    },
  }, acessoController.registrarAcesso);
}

module.exports = routes;