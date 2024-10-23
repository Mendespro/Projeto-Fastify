const fp  = require('fastify-plugin');
const { PrismaClient } = require('prisma/client');

async function prismaPlugin(fastify, options) {
    const prisma =  new PrismaClient();
    await prisma.$connect();

    fastify.addHook('onClose', async(fastify) => {
        await prisma.$disconnect();
    })

    fastify.decorate('prisma', prisma);
}

module.exports = fp(prismaPlugin);