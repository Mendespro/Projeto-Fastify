const fastify = require('fastify')({ logger: true })
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Registre as rotas
fastify.register(require('./routes/userRoutes'))

// Adicione um hook para fechar a conexão do Prisma quando o servidor for encerrado
fastify.addHook('onClose', async (instance, done) => {
  await prisma.$disconnect()
  done()
})

// Função para iniciar o servidor
async function start() {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()

module.exports = { fastify, prisma }