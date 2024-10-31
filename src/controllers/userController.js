const { prisma } = require('../app')

const userController = {
  getAllUsers: async (request, reply) => {
    const users = await prisma.user.findMany()
    return users
  },

  getUserById: async (request, reply) => {
    const { id } = request.params
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) }
    })
    if (!user) {
      reply.code(404).send({ message: 'User not found' })
    }
    return user
  },

  createUser: async (request, reply) => {
    const { email, name } = request.body
    const user = await prisma.user.create({
      data: { email, name }
    })
    reply.code(201).send(user)
  },

  updateUser: async (request, reply) => {
    const { id } = request.params
    const { email, name } = request.body
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { email, name }
    })
    return updatedUser
  },

  deleteUser: async (request, reply) => {
    const { id } = request.params
    await prisma.user.delete({
      where: { id: parseInt(id) }
    })
    reply.code(204).send()
  }
}

module.exports = userController