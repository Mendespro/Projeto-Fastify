const fastify = require('fastify')({ logger: true })
const prismaPlugin = require('./plugins/prismaPlugin');
userRoutes = require('./routes/userRoutes')

fastify.register(prismaPlugin);
fastify.register(userRoutes, { prefix: '/api/users' });

module.exports = fastify



module.exports = { fastify, prisma }