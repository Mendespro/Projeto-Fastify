const { PrismaClient } = require('@prisma/client');  // Importa o PrismaClient
const prisma = new PrismaClient();  // Inicializa o PrismaClient

// Teste de conexão com o banco de dados
async function testDatabaseConnection() {
  try {
    await prisma.$connect();  // Tentando conectar ao banco de dados
    console.log('Conexão com o banco de dados bem-sucedida!');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  } finally {
    await prisma.$disconnect();  // Garante que a conexão será encerrada após o teste
  }
}

testDatabaseConnection();
