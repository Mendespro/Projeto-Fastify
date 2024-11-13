const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminExists = await prisma.usuario.findUnique({
    where: { email: 'admin@exemplo.com' },
  });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 10); // Senha padrão para ADMIN

    await prisma.usuario.create({
      data: {
        nome: 'Administrador',
        email: 'admin@exemplo.com',
        senha: hashedPassword,
        role: 'ADMIN',
        saldo: 0,
        matricula: 'ADM001'
      },
    });
    console.log('Administrador padrão criado!');
  }

  const alunoExists = await prisma.usuario.findUnique({
    where: { email: 'aluno@exemplo.com' },
  });

  if (!alunoExists) {
    await prisma.usuario.create({
      data: {
        nome: 'Aluno Exemplo',
        email: 'aluno@exemplo.com',
        role: 'ALUNO',
        saldo: 0,
        matricula: 'ALN001'
      },
    });
    console.log('Aluno padrão criado sem senha!');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
