const authController = require('../controllers/authController');

async function routes(fastify) {fastify.post('/login', authController.login);}

module.exports = routes;
