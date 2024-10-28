const userModel = {
    findAll: async (prisma) => {
      return await prisma.user.findMany()
    },
    findById: async (prisma, id) => {
      return await prisma.user.findUnique({
        where: { id }
      })
    },
    create: async (prisma, userData) => {
        try{
            return await prisma.user.create({
                data: userData
            })
        }catch(error) {
            console.log(error);
        }

    },
    update: async (prisma, id, userData) => {
      return await prisma.user.update({
        where: { id },
        data: userData
      })
    },
    delete: async (prisma, id) => {
      return await prisma.user.delete({
        where: { id }
      })
    }
  }
  
  module.exports = userModel