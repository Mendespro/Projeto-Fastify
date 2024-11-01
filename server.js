import Fastify from 'fastify'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const fastify = Fastify({ logger: true });

fastify.get('/users', async (request, reply) => {
  try {
    const users = await prisma.user.findMany()
    reply.send(users);
  }catch(e) {
    reply.status(500).send(error);
  }
});

fastify.post("/users", async (request, reply) => {
  const { name, email } = request.body;
  try {
    const user = await prisma.user.create({
      data: { name, email },
    });
    reply.send(user);
  } catch (error) {
    reply.status(500).send(error);
  }
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log("Servidor rodando em http://localhost:3000");
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();