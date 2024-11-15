const fastify = require('fastify')({ logger: true });
const prisma = require('./config/database');
const swagger = require('@fastify/swagger');
const cors = require('@fastify/cors'); // Adiciona o CORS

// Configura o CORS
fastify.register(cors, {
  origin: true, // Permite qualquer origem. Para segurança, especifique o domínio do front-end
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
});

fastify.register(swagger, {
  routePrefix: '/documentation',
  swagger: {
    info: { title: 'Smart Campus API', version: '1.0.0' },
    host: 'localhost:3000',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json']
  },
  exposeRoute: true
});

fastify.addHook('onClose', async (instance, done) => {
  await prisma.$disconnect();
  done();
});

module.exports = { fastify, prisma };
