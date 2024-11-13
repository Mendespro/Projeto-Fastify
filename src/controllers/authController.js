const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authController = {
  async login(request, reply) {
    const { email, senha } = request.body;

    try {
      // Verifica se o usuário existe e é funcionário ou administrador
      const usuario = await prisma.usuario.findFirst({
        where: {
          email,
          role: { in: ['ADMIN', 'FUNCIONARIO'] }
        }
      });

      if (!usuario || !bcrypt.compareSync(senha, usuario.senha)) {
        return reply.status(401).send({ error: 'Credenciais inválidas' });
      }

      // Gera o token JWT
      const token = jwt.sign(
        { id: usuario.id, role: usuario.role, nome: usuario.nome },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      reply.status(200).send({ message: 'Login bem-sucedido', token });
    } catch (error) {
      console.error("Erro no login:", error);
      reply.status(500).send({ error: "Erro ao fazer login" });
    }
  }
};

module.exports = authController;
