const fastify = require('fastify')({ logger: true });
const prisma = require('./config/database');
const swagger = require('@fastify/swagger');
const cors = require('@fastify/cors'); 
const multipart = require('@fastify/multipart'); 

fastify.register(multipart);

fastify.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

fastify.register(swagger, {
  routePrefix: '/documentation',
  swagger: {
    info: { title: 'Smart Campus API', version: '1.0.0' },
    host: 'localhost:3000',
    schemes: ['http'],
    consumes: ['application/json', 'multipart/form-data'],
    produces: ['application/json']
  },
  exposeRoute: true
});

fastify.addHook('onClose', async (instance, done) => {
  await prisma.$disconnect();
  done();
});

module.exports = { fastify, prisma };
