const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const usuarioController = {
  // Criar novo usuário
  async criar(request, reply) {
    try {
      const { nome, matricula, email, senha } = request.body;

      const usuarioExistente = await prisma.usuario.findUnique({
        where: { matricula }
      });

      if (usuarioExistente) {
        return reply.code(400).send({
          error: 'Usuário já existe com esta matrícula'
        });
      }

      const usuario = await prisma.usuario.create({
        data: {
          nome,
          matricula,
          email,
          senha // Lembre-se de adicionar hash na senha antes de salvar
        }
      });

      return reply.code(201).send(usuario);
    } catch (error) {
      return reply.code(500).send({
        error: 'Erro ao criar usuário'
      });
    }
  },

  // Buscar usuário por matrícula
  async buscarPorMatricula(request, reply) {
    try {
      const { matricula } = request.params;

      const usuario = await prisma.usuario.findUnique({
        where: { matricula },
        include: {
          cartoes: true,
          refeicoes: true,
          depositos: true
        }
      });

      if (!usuario) {
        return reply.code(404).send({
          error: 'Usuário não encontrado'
        });
      }

      return reply.send(usuario);
    } catch (error) {
      return reply.code(500).send({
        error: 'Erro ao buscar usuário'
      });
    }
  },

  // Atualizar saldo
  async atualizarSaldo(request, reply) {
    try {
      const { matricula } = request.params;
      const { valor } = request.body;

      const usuario = await prisma.usuario.update({
        where: { matricula },
        data: {
          saldo: {
            increment: valor
          }
        }
      });

      return reply.send(usuario);
    } catch (error) {
      return reply.code(500).send({
        error: 'Erro ao atualizar saldo'
      });
    }
  }
};

module.exports = usuarioController;