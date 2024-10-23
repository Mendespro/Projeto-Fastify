const userService = {
    getAllUsers: async (prisma) => {
      return await prisma.user.findMany()
    },
  
    getUserById: async (prisma, id) => {
      return await prisma.user.findUnique({
        where: { id }
      })
    },
  
    createUser: async (prisma, userData) => {
      return await prisma.user.create({
        data: userData
      })
    },
  
    updateUser: async (prisma, id, userData) => {
      return await prisma.user.update({
        where: { id },
        data: userData
      })
    },
  
    deleteUser: async (prisma, id) => {
      return await prisma.user.delete({
        where: { id }
      })
    }
  }
  
  module.exports = userService