const usuarioController = require('../controllers/usuarioController');

async function routes(fastify) {
  fastify.post('/usuarios', usuarioController.criarUsuario);
  fastify.get('/usuarios/:matricula', usuarioController.buscarPorMatricula);
  fastify.put('/usuarios/:matricula/saldo', usuarioController.atualizarSaldo);
}

module.exports = routes;