const { fastify } = require('./src/app');

fastify.register(require('./src/routes/authRoutes'));        
fastify.register(require('./src/routes/transacaoRoutes'));   
fastify.register(require('./src/routes/usuarioRoutes'));  

fastify.get('/', async (request, reply) => {
    reply.send({ message: 'Bem-vindo ao Smart Campus API!' });
});

let server;

async function startServer() {
  if (!server) {
    server = fastify;
    await server.listen({ port: 3001 });
  }
  return server;
}

async function stopServer() {
  if (server) {
    try {
      await server.close();
      console.log('Servidor fechado com sucesso');
    } catch (error) {
      console.error('Erro ao fechar o servidor:', error.message);
    } finally {
      server = null;
    }
  }
}

after(async () => {
  await stopServer(); // Garante que o servidor seja fechado após os testes
});

module.exports = { startServer, stopServer };
