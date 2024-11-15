const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { comparePassword } = require('../utils/hash');

const loginController = async (request, reply) => {
  const { email, senha } = request.body;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario || (usuario.senha && !comparePassword(senha, usuario.senha))) {
      return reply.code(401).send({ error: 'Credenciais inválidas' });
    }

    // Cria o token JWT com o papel do usuário
    const token = jwt.sign({ id: usuario.id, role: usuario.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    reply.send({ token });
  } catch (error) {
    console.error("Erro no login:", error);
    reply.code(500).send({ error: 'Erro ao fazer login' });
  }
};

module.exports = loginController;
