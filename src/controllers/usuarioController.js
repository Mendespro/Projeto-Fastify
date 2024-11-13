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
        return reply.status(400).send({ error: 'Já existe um usuário com esta matrícula ou email' });
      }

      let hashedPassword = null;

      // Verifica se o usuário é um funcionário ou administrador e exige senha
      if (role === 'FUNCIONARIO' || role === 'ADMIN') {
        hashedPassword = hashPassword(senha);
      }

      // Cria o usuário sem senha para alunos
      const novoUsuario = await prisma.usuario.create({
        data: {
          nome,
          matricula,
          email,
          senha: hashedPassword,
          role
        }
      });

      // Se for aluno, cria um cartão automaticamente associado ao usuário
      if (role === 'ALUNO') {
        const hashCartao = generateCardHash(matricula);
        console.log("Hash do Cartão Gerado:", hashCartao);

        await prisma.cartao.create({
          data: {
            hashCartao: hashCartao,
            status: 'ATIVO',
            idUsuario: novoUsuario.id
          }
        });
      }

      reply.status(201).send({ message: 'Usuário criado com sucesso!', usuario: novoUsuario });
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      reply.status(500).send({ error: "Erro ao criar usuário" });
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
  },
  
  async bloquearCartao(request, reply) {
    try {
      const { idCartao, motivo } = request.body;

      // Valida se o cartão existe e está ativo
      const cartao = await prisma.cartao.findUnique({
        where: { id: idCartao },
      });

      if (!cartao || cartao.status === 'BLOQUEADO') {
        return reply.status(400).send({ error: 'Cartão inválido ou já bloqueado' });
      }

      // Bloqueia o cartão e registra o motivo do bloqueio
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

      reply.status(200).send({ message: 'Cartão bloqueado com sucesso' });
    } catch (error) {
      console.error('Erro ao bloquear cartão:', error);
      reply.status(500).send({ error: 'Erro ao bloquear cartão' });
    }
  },

  async desbloquearCartao(request, reply) {
    try {
      const { idCartao } = request.body;
  
      // Verifica se o cartão já está ativo
      const cartao = await prisma.cartao.findUnique({
        where: { id: idCartao },
      });
  
      if (!cartao || cartao.status === 'ATIVO') {
        return reply.status(400).send({ error: 'Cartão inválido ou já está ativo' });
      }
  
      // Atualiza o status do cartão para ativo
      await prisma.cartao.update({
        where: { id: idCartao },
        data: { status: 'ATIVO' },
      });
  
      reply.status(200).send({ message: 'Cartão desbloqueado com sucesso' });
    } catch (error) {
      console.error('Erro ao desbloquear cartão:', error);
      reply.status(500).send({ error: 'Erro ao desbloquear cartão' });
    }
  },

  async gerarRelatorio(request, reply) {
    try {
      const { dataInicio, dataFim } = request.query;

      // Buscar transações com base no intervalo de datas fornecido
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

      reply.status(200).send({ relatorio });
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      reply.status(500).send({ error: 'Erro ao gerar relatório' });
    }
  }
};

module.exports = usuarioController;
