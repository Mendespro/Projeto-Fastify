const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('Conexão com o banco de dados bem-sucedida!');
    const usuarios = await prisma.usuario.findMany();
    console.log(usuarios);
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  } finally {
    await prisma.$disconnect();
  }
};

testDatabaseConnection();
