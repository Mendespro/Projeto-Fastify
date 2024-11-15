const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { hashPassword, generateCardHash } = require('../utils/hash');

const usuarioController = {
  async criarUsuario(request, reply) {
    try {
      const { nome, matricula, email, senha, role } = request.body;

      // Verifica se já existe um usuário com o mesmo e-mail ou matrícula
      const usuarioExistente = await prisma.usuario.findFirst({
        where: {
          OR: [
            { matricula },
            { email }
          ]
        }
      });

      if (usuarioExistente) {
        return reply.code(400).send({ error: 'Já existe um usuário com esta matrícula ou email' });
      }

      let hashedPassword = null;

      // Define senha para FUNCIONARIO ou ADMIN
      if (role === 'FUNCIONARIO' || role === 'ADMIN') {
        hashedPassword = hashPassword(senha);
      }

      // Cria o usuário
      const novoUsuario = await prisma.usuario.create({
        data: {
          nome,
          matricula,
          email,
          senha: hashedPassword,
          role
        }
      });

      // Gera o cartão automaticamente para ALUNO
      if (role === 'ALUNO') {
        const hashCartao = generateCardHash(matricula);

        await prisma.cartao.create({
          data: {
            hashCartao: hashCartao,
            status: 'ATIVO',
            idUsuario: novoUsuario.id
          }
        });
      }

      reply.code(201).send({ message: 'Usuário criado com sucesso!', usuario: novoUsuario });
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      reply.code(500).send({ error: "Erro ao criar usuário" });
    }
  },

  async buscarPorMatricula(request, reply) {
    try {
      const { matricula } = request.params;

      const usuario = await prisma.usuario.findUnique({
        where: { matricula },
        include: { cartoes: true, historicos: true }
      });

      if (!usuario) {
        return reply.code(404).send({ error: 'Usuário não encontrado' });
      }

      reply.send(usuario);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      reply.code(500).send({ error: 'Erro ao buscar usuário' });
    }
  },

  async atualizarSaldo(request, reply) {
    try {
      const { matricula } = request.params;
      const { valor } = request.body;

      if (typeof valor !== 'number' || valor <= 0) {
        return reply.code(400).send({ error: 'Valor inválido para atualização de saldo' });
      }

      const usuario = await prisma.usuario.update({
        where: { matricula },
        data: { saldo: { increment: valor } }
      });

      reply.send({
        message: 'Saldo atualizado com sucesso!',
        usuario
      });
    } catch (error) {
      console.error('Erro ao atualizar saldo:', error);
      reply.code(500).send({ error: 'Erro ao atualizar saldo' });
    }
  },
  
  async bloquearCartao(request, reply) {
    try {
      const { idCartao, motivo } = request.body;

      const cartao = await prisma.cartao.findUnique({
        where: { id: idCartao },
      });

      if (!cartao || cartao.status === 'BLOQUEADO') {
        return reply.code(400).send({ error: 'Cartão inválido ou já bloqueado' });
      }

      await prisma.cartao.update({
        where: { id: idCartao },
        data: { status: 'BLOQUEADO' },
      });

      await prisma.bloqueioCartao.create({
        data: {
          idCartao: cartao.id,
          motivoBloqueio: motivo || 'Motivo não especificado',
          temporario: false,
        },
      });

      reply.code(200).send({ message: 'Cartão bloqueado com sucesso' });
    } catch (error) {
      console.error('Erro ao bloquear cartão:', error);
      reply.code(500).send({ error: 'Erro ao bloquear cartão' });
    }
  },

  async desbloquearCartao(request, reply) {
    try {
      const { idCartao } = request.body;
  
      const cartao = await prisma.cartao.findUnique({
        where: { id: idCartao },
      });
  
      if (!cartao || cartao.status === 'ATIVO') {
        return reply.code(400).send({ error: 'Cartão inválido ou já está ativo' });
      }
  
      await prisma.cartao.update({
        where: { id: idCartao },
        data: { status: 'ATIVO' },
      });
  
      reply.code(200).send({ message: 'Cartão desbloqueado com sucesso' });
    } catch (error) {
      console.error('Erro ao desbloquear cartão:', error);
      reply.code(500).send({ error: 'Erro ao desbloquear cartão' });
    }
  },

  async gerarRelatorio(request, reply) {
    try {
      const { dataInicio, dataFim } = request.query;

      const relatorio = await prisma.historicoTransacao.findMany({
        where: {
          dataTransacao: {
            gte: new Date(dataInicio),
            lte: new Date(dataFim)
          }
        },
        include: {
          usuario: { select: { nome: true, matricula: true } }
        },
        orderBy: { dataTransacao: 'desc' }
      });

      reply.code(200).send({ relatorio });
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      reply.code(500).send({ error: 'Erro ao gerar relatório' });
    }
  }
};

module.exports = usuarioController;
