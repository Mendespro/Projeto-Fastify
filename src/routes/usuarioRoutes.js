const usuarioController = require('../controllers/usuarioController');
const verificarPermissao = require('../middleware/auth');

async function routes(fastify) {
  fastify.post('/usuarios', { preHandler: verificarPermissao('FUNCIONARIO') }, usuarioController.criarUsuario);
  fastify.get('/usuarios/:matricula', { preHandler: verificarPermissao('FUNCIONARIO') }, usuarioController.buscarPorMatricula);

  fastify.post('/usuarios/:matricula/saldo', { preHandler: verificarPermissao('FUNCIONARIO') }, usuarioController.atualizarSaldo);
  fastify.put('/usuarios/:matricula/saldo', { preHandler: verificarPermissao('FUNCIONARIO') }, usuarioController.atualizarSaldo);

  fastify.post('/usuarios/recarregar', usuarioController.recarregarCartao);

  fastify.post('/usuarios/bloquear', { preHandler: verificarPermissao('FUNCIONARIO') }, usuarioController.bloquearCartao);
  fastify.post('/usuarios/desbloquear', { preHandler: verificarPermissao('FUNCIONARIO') }, usuarioController.desbloquearCartao);

  fastify.get('/usuarios/relatorio', { preHandler: verificarPermissao('ADMIN') }, usuarioController.gerarRelatorio);
}

module.exports = routes;
