const { PrismaClient } = require('@prisma/client');
const { hashPassword, generateCardHash } = require('../src/utils/hash');
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.usuario.upsert({
    where: { matricula: "000000001" },
    update: {},
    create: {
      nome: "Administrador",
      matricula: "000000001",
      email: "admin@smartcampus.com",
      senha: hashPassword("admin123"),
      role: "ADMIN",
    },
  });

  const funcionario = await prisma.usuario.upsert({
    where: { matricula: "000000002" },
    update: {},
    create: {
      nome: "Funcionário",
      matricula: "000000002",
      email: "funcionario@smartcampus.com",
      senha: hashPassword("func123"),
      role: "FUNCIONARIO",
    },
  });

  const aluno = await prisma.usuario.upsert({
    where: { matricula: "000000003" },
    update: {},
    create: {
      nome: "Aluno Exemplo",
      matricula: "000000003",
      email: "aluno@smartcampus.com",
      role: "ALUNO",
    },
  });

  const hashCartaoAluno = generateCardHash("000000003");
  await prisma.cartao.upsert({
    where: { hashCartao: hashCartaoAluno },
    update: {},
    create: {
      hashCartao: hashCartaoAluno,
      status: "ATIVO",
      idUsuario: aluno.id,
      ultimoTimestamp: new Date(),
      leitorId: "leitor123",
    },
  });

  console.log("Seed executado com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
