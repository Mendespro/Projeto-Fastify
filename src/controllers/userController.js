const userService = require('../services/userService')

const userController = {
  getAllUsers: async (request, reply) => {
    const users = await userService.getAllUsers(request.server.prisma)
    return users
  },

  getUserById: async (request, reply) => {
    const { id } = request.params
    const user = await userService.getUserById(request.server.prisma, parseInt(id))
    if (!user) {
      reply.code(404).send({ error: 'User not found' })
      return
    }
    return user
  },

  createUser: async (request, reply) => {
    try {
      const user = await userService.createUser(request.server.prisma, request.body)
      reply.code(201)
      return user
    } catch (error) {
      if (error.code === 'P2002') {
        reply.code(400).send({ error: 'Email already exists' })
        return
      }
      throw error
    }
  },

  updateUser: async (request, reply) => {
    const { id } = request.params
    const user = await userService.updateUser(
      request.server.prisma,
      parseInt(id),
      request.body
    )
    if (!user) {
      reply.code(404).send({ error: 'User not found' })
      return
    }
    return user
  },

  deleteUser: async (request, reply) => {
    const { id } = request.params
    try {
      await userService.deleteUser(request.server.prisma, parseInt(id))
      reply.code(204).send()
    } catch (error) {
      reply.code(404).send({ error: 'User not found' })
    }
  }
}

module.exports = userController