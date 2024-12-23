const { fastify } = require('./app');

fastify.register(require('./routes/authRoutes'));
fastify.register(require('./routes/transacaoRoutes'));
fastify.register(require('./routes/usuarioRoutes'));

fastify.get('/', async (request, reply) => {
  reply.send({ message: 'Bem-vindo ao Smart Campus API!' });
});

const start = async () => {
  try {
    await fastify.listen({ port: 3001 });
    console.log('Server is running on http://127.0.0.1:3001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
