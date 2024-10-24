const fastify = require('fastify')({ logger: true })
const prismaPlugin = require('./plugins/prismaPlugin')
const userRoutes = require('./routes/userRoutes')

fastify.register(prismaPlugin)
fastify.register(userRoutes, { prefix: '/api/users' })

module.exports = fastify