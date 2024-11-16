const transacaoController = require('../controllers/transacaoController');

async function routes(fastify) {
  fastify.post('/transacao/acesso', transacaoController.registrarAcesso);
  fastify.post('/transacao/recarga', transacaoController.realizarRecarga);
  fastify.post('/transacao/bloqueio', transacaoController.bloquearCartao);
  fastify.get('/transacao/relatorio', transacaoController.gerarRelatorio);
  fastify.get('/transacao/relatorio/pdf', transacaoController.gerarRelatorioPdf)
}

module.exports = routes;
