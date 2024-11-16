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
          role: { in: ['ADMIN', 'FUNCIONARIO'] },
        },
      });

      if (!usuario || !bcrypt.compareSync(senha, usuario.senha)) {
        return reply.status(401).send({ error: 'Credenciais inválidas' });
      }

      // Garante que a chave JWT esteja definida
      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET não está configurada');
        return reply.status(500).send({ error: 'Erro de configuração no servidor' });
      }

      // Gera o token JWT
      const token = jwt.sign(
        { id: usuario.id, role: usuario.role, nome: usuario.nome },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Registra o login no histórico de transações
      await prisma.historicoTransacao.create({
        data: {
          tipoTransacao: 'LOGIN',
          valor: 0, // Logins não possuem valor associado
          idUsuario: usuario.id,
        },
      });

      reply.status(200).send({
        message: 'Login bem-sucedido',
        token,
        usuario: { id: usuario.id, nome: usuario.nome, role: usuario.role },
      });
    } catch (error) {
      console.error('Erro no login:', error);
      reply.status(500).send({ error: 'Erro ao processar login' });
    }
  },
};

module.exports = authController;
