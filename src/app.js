const fastify = require('fastify')({ logger: true });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

fastify.addHook('onClose', async (instance, done) => {
  await prisma.$disconnect();
  done();
});

module.exports = { fastify, prisma };