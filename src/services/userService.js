const userModel = require('../models/userModel')

const userService = {
  getAllUsers: async (prisma) => {
    return await userModel.findAll(prisma)
  },
  getUserById: async (prisma, id) => {
    return await userModel.findById(prisma, id)
  },
  createUser: async (prisma, userData) => {
    return await userModel.create(prisma, userData)
  },
  updateUser: async (prisma, id, userData) => {
    return await userModel.update(prisma, id, userData)
  },
  deleteUser: async (prisma, id) => {
    return await userModel.delete(prisma, id)
  }
}

module.exports = userService