const userController = require('../controllers/userController');
const { verificarToken, verificarAdmin } = require('../middlewares/auth');

async function routes(fastify, options) {
  fastify.get('/users', { preHandler: [verificarToken, verificarAdmin] }, userController.getAllUsers);
  fastify.get('/users/:id', { preHandler: [verificarToken, verificarAdmin] }, userController.getUserById);
  fastify.post('/users', { preHandler: [verificarToken, verificarAdmin] }, userController.createUser);
  fastify.put('/users/:id', { preHandler: [verificarToken, verificarAdmin] }, userController.updateUser);
  fastify.delete('/users/:id', { preHandler: [verificarToken, verificarAdmin] }, userController.deleteUser);
}

module.exports = routes;
