const usuarioController = require('../controllers/usuarioController');
const verificarPermissao = require('../middleware/auth');

async function routes(fastify) {
  // Rotas que apenas funcionários e administradores podem acessar
  fastify.post('/usuarios', { preHandler: verificarPermissao('FUNCIONARIO') }, usuarioController.criarUsuario);
  fastify.get('/usuarios/:matricula', { preHandler: verificarPermissao('FUNCIONARIO') }, usuarioController.buscarPorMatricula);

  // Rota de atualização de saldo
  fastify.post('/usuarios/:matricula/saldo', { preHandler: verificarPermissao('FUNCIONARIO') }, usuarioController.atualizarSaldo);
  fastify.put('/usuarios/:matricula/saldo', { preHandler: verificarPermissao('FUNCIONARIO') }, usuarioController.atualizarSaldo);

  // Rota de recarga de cartão
  fastify.post('/usuarios/recarregar', usuarioController.recarregarCartao);

  // Rotas de bloqueio/desbloqueio e recarga disponíveis para funcionários e administradores
  fastify.post('/usuarios/bloquear', { preHandler: verificarPermissao('FUNCIONARIO') }, usuarioController.bloquearCartao);
  fastify.post('/usuarios/desbloquear', { preHandler: verificarPermissao('FUNCIONARIO') }, usuarioController.desbloquearCartao);

  // Rota de relatório disponível apenas para o administrador
  fastify.get('/usuarios/relatorio', { preHandler: verificarPermissao('ADMIN') }, usuarioController.gerarRelatorio);
}

module.exports = routes;