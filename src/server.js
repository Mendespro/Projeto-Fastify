const { fastify } = require('./app');

fastify.register(require('./routes/transacaoRoutes'));
fastify.register(require('./routes/usuarioRoutes'));

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log('Server is running on http://127.0.0.1:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
