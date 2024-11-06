const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { hashPassword } = require('../utils/hash');

const usuarioController = {
  async criarUsuario(request, reply) {
    try {
      const { nome, matricula, email, senha } = request.body;
      
      // Verifica se o usuário já existe
      const usuarioExistente = await prisma.usuario.findUnique({ where: { matricula } });
      if (usuarioExistente) {
        return reply.code(400).send({ error: 'Usuário já existe com esta matrícula' });
      }

      // Criptografa a senha e cria o usuário
      const hashedPassword = hashPassword(senha);
      const usuario = await prisma.usuario.create({
        data: { nome, matricula, email, senha: hashedPassword }
      });

      return reply.code(201).send({
        message: 'Usuário criado com sucesso!',
        usuario
      });
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      return reply.code(500).send({ error: 'Erro ao criar usuário' });
    }
  },

  async buscarPorMatricula(request, reply) {
    try {
      const { matricula } = request.params;
      
      // Busca usuário pelo número de matrícula
      const usuario = await prisma.usuario.findUnique({
        where: { matricula },
        include: { cartoes: true, historicos: true }
      });

      if (!usuario) {
        return reply.code(404).send({ error: 'Usuário não encontrado' });
      }

      return reply.send(usuario);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return reply.code(500).send({ error: 'Erro ao buscar usuário' });
    }
  },

  async atualizarSaldo(request, reply) {
    try {
      const { matricula } = request.params;
      const { valor } = request.body;

      // Valida o valor do saldo
      if (typeof valor !== 'number' || valor <= 0) {
        return reply.code(400).send({ error: 'Valor inválido para atualização de saldo' });
      }

      // Atualiza o saldo do usuário
      const usuario = await prisma.usuario.update({
        where: { matricula },
        data: { saldo: { increment: valor } }
      });

      return reply.send({
        message: 'Saldo atualizado com sucesso!',
        usuario
      });
    } catch (error) {
      console.error('Erro ao atualizar saldo:', error);
      return reply.code(500).send({ error: 'Erro ao atualizar saldo' });
    }
  }
};

module.exports = usuarioController;
