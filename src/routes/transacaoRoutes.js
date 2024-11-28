const transacaoController = require('../controllers/transacaoController');
const preventReplay = require('../middleware/preventReplay');

async function routes(fastify) {
  fastify.post('/transacao/acesso', { preHandler: preventReplay }, transacaoController.registrarAcesso);
  fastify.post('/transacao/recarga', transacaoController.realizarRecarga);
  fastify.post('/transacao/bloqueio', transacaoController.bloquearCartao);
  fastify.get('/transacao/relatorio', transacaoController.gerarRelatorio);
  fastify.get('/transacao/relatorio/pdf', transacaoController.gerarRelatorioPdf)
}

module.exports = routes;
