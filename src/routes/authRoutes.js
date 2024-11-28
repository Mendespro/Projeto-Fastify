const authController = require('../controllers/authController');

async function routes(fastify) {
  fastify.post('/login', authController.login);
  fastify.get('/validate-token', authController.validateToken); // Nova rota
}

module.exports = routes;
