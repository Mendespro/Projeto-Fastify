const fastify = require('fastify')({ logger: true });

// Registra as rotas
fastify.register(require('./routes/acessoRoutes'));
fastify.register(require('./routes/cartaoRoutes'));
fastify.register(require('./routes/depositoRoutes'));
fastify.register(require('./routes/refeicaoRoutes'));
fastify.register(require('./routes/usuarioRoutes'));

// Inicia o servidor
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();