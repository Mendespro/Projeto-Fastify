const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { hashPassword, generateCardHash } = require('../utils/hash');
const { validarEntradaUsuario } = require('../utils/validators');

const usuarioController = {
  async criarUsuario(request, reply) {
    try {
      const parts = await request.parts();
      let usuarioData = {};
      for await (const part of parts) {
        if (part.file) {
          usuarioData.fotoUsuario = await part.toBuffer();
        } else {
          usuarioData[part.fieldname] = part.value;
        }
      }
  
      // Valida entrada
      validarEntradaUsuario(usuarioData.nome, usuarioData.matricula, usuarioData.senha, usuarioData.role);
  
      // Verifica duplicidade
      const usuarioExistente = await prisma.usuario.findFirst({
        where: { OR: [{ matricula: usuarioData.matricula }, { email: usuarioData.email }] },
      });
  
      if (usuarioExistente) {
        return reply.code(400).send({ error: 'Matrícula ou email já cadastrados.' });
      }
  
      // Criação com transação
      await prisma.$transaction(async (tx) => {
        const senha = usuarioData.role !== 'ALUNO' ? hashPassword(usuarioData.senha) : null;
  
        const usuarioCriado = await tx.usuario.create({
          data: {
            nome: usuarioData.nome,
            matricula: usuarioData.matricula,
            email: usuarioData.email,
            senha,
            fotoUsuario: usuarioData.fotoUsuario || null,
            role: usuarioData.role,
          },
        });
  
        if (usuarioData.role === 'ALUNO') {
          const hashCartao = generateCardHash(usuarioData.matricula);
          await tx.cartao.create({
            data: {
              hashCartao,
              status: 'ATIVO',
              idUsuario: usuarioCriado.id,
            },
          });
        }
  
        // **Registro no histórico**
        await tx.historicoTransacao.create({
          data: {
            tipoTransacao: 'CADASTRO',
            idUsuario: usuarioCriado.id, // Usuário que foi criado
            responsavelId: request.userData.id, // Usuário responsável (vem do token JWT)
            valor: 0, // Sem valor associado ao cadastro
          },
        });
      });
  
      return reply.code(201).send({ message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
  
      if (error.code === 'P2002') {
        return reply.code(400).send({ error: 'Matrícula ou email já estão em uso.' });
      }
  
      return reply.code(500).send({ error: 'Erro ao processar cadastro.' });
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

  async recarregarCartao(request, reply) {
    try {
      const { idCartao, valor } = request.body;
  
      if (valor <= 0) {
        return reply.code(400).send({ error: 'Valor de recarga inválido' });
      }
  
      const cartao = await prisma.cartao.findUnique({
        where: { id: parseInt(idCartao, 10) },
        include: { usuario: true },
      });
  
      if (!cartao) {
        return reply.code(404).send({ error: 'Cartão não encontrado' });
      }
  
      const novoSaldo = cartao.usuario.saldo + valor;
  
      await prisma.$transaction(async (tx) => {
        // Atualiza o saldo do usuário
        await tx.usuario.update({
          where: { id: cartao.usuario.id },
          data: { saldo: novoSaldo },
        });
  
        // Registra a transação no histórico
        await tx.historicoTransacao.create({
          data: {
            tipoTransacao: 'DEPOSITO',
            valor,
            idUsuario: cartao.usuario.id,
            responsavelId: request.userData?.id || null, // Garante o registro do responsável, se disponível
          },
        });
      });
  
      return reply.code(200).send({ message: 'Recarga realizada com sucesso', saldo: novoSaldo });
    } catch (error) {
      console.error('Erro ao recarregar cartão:', error);
      return reply.code(500).send({ error: 'Erro ao recarregar cartão' });
    }
  },

  async atualizarSaldo(request, reply) {
    try {
      const { matricula } = request.params;
      const { valor } = request.body;
  
      if (valor <= 0) {
        return reply.code(400).send({ error: 'Valor de recarga inválido' });
      }
  
      // Encontre o usuário pelo campo matrícula
      const usuario = await prisma.usuario.findUnique({
        where: { matricula: matricula }
      });
  
      if (!usuario) {
        return reply.code(404).send({ error: 'Usuário não encontrado' });
      }
  
      // Atualize o saldo do usuário
      const novoSaldo = usuario.saldo + valor;
      await prisma.usuario.update({
        where: { matricula: matricula },
        data: { saldo: novoSaldo }
      });
      
      const transacao = await prisma.historicoTransacao.create({
        data: {
          tipoTransacao: 'DEPOSITO',
          valor,
          idUsuario: cartao.idUsuario,
          responsavelId: req.userData.id, 
        },
      });

      console.log('Saldo atualizado com sucesso');
      return reply.code(200).send({ message: 'Saldo atualizado com sucesso', saldo: novoSaldo });
    } catch (error) {
      console.error('Erro ao atualizar saldo:', error);
      return reply.code(500).send({ error: 'Erro ao atualizar saldo' });
    }
  },  
  
  async bloquearCartao(request, reply) {
    try {
      const { idCartao, motivo } = request.body;
      const cartaoId = parseInt(idCartao, 10);
  
      if (isNaN(cartaoId)) {
        return reply.code(400).send({ error: 'ID do cartão inválido' });
      }
  
      const cartao = await prisma.cartao.findUnique({
        where: { id: cartaoId },
      });
  
      if (!cartao) {
        return reply.code(404).send({ error: 'Cartão não encontrado' });
      }
  
      if (cartao.status === 'BLOQUEADO') {
        return reply.code(400).send({ error: 'Cartão já está bloqueado' });
      }
  
      await prisma.cartao.update({
        where: { id: cartaoId },
        data: { status: 'BLOQUEADO' },
      });
  
      await prisma.bloqueioCartao.create({
        data: {
          idCartao: cartaoId,
          motivoBloqueio: motivo || 'Motivo não especificado',
          temporario: false,
        },
      });
  
      // **Adição ao Histórico de Transações**
      await prisma.historicoTransacao.create({
        data: {
          tipoTransacao: 'BLOQUEIO',
          idUsuario: cartao.idUsuario,
          responsavelId: request.userData.id, // Usuário responsável
          valor: 0,
          dataTransacao: new Date(),
        },
      });
  
      console.log('Cartão bloqueado com sucesso');
      return reply.code(200).send({ message: 'Cartão bloqueado com sucesso' });
    } catch (error) {
      console.error('Erro ao bloquear cartão:', error);
      return reply.code(500).send({ error: 'Erro ao bloquear cartão' });
    }
  },

  async desbloquearCartao(request, reply) {
    try {
      const { idCartao } = request.body;
      const cartaoId = parseInt(idCartao, 10);
  
      if (isNaN(cartaoId)) {
        return reply.code(400).send({ error: 'ID do cartão inválido' });
      }
  
      const cartao = await prisma.cartao.findUnique({
        where: { id: cartaoId },
      });
  
      if (!cartao) {
        return reply.code(404).send({ error: 'Cartão não encontrado' });
      }
  
      if (cartao.status === 'ATIVO') {
        return reply.code(400).send({ error: 'Cartão já está ativo' });
      }
  
      await prisma.cartao.update({
        where: { id: cartaoId },
        data: { status: 'ATIVO' },
      });
  
      // **Adição ao Histórico de Transações**
      await prisma.historicoTransacao.create({
        data: {
          tipoTransacao: 'DESBLOQUEIO',
          idUsuario: cartao.idUsuario,
          responsavelId: request.userData.id, // Usuário responsável
          valor: 0,
          dataTransacao: new Date(),
        },
      });
  
      console.log('Cartão desbloqueado com sucesso');
      return reply.code(200).send({ message: 'Cartão desbloqueado com sucesso' });
    } catch (error) {
      console.error('Erro ao desbloquear cartão:', error);
      return reply.code(500).send({ error: 'Erro ao desbloquear cartão' });
    }
  },

  async gerarRelatorio(request, reply) {
    try {
      const { dataInicio, dataFim, tipoTransacao } = request.query;
  
      if (!dataInicio || !dataFim) {
        return reply.code(400).send({ message: 'Datas de início e fim são obrigatórias.' });
      }
  
      const filtros = {
        dataTransacao: {
          gte: new Date(dataInicio),
          lte: new Date(dataFim),
        },
      };
  
      if (tipoTransacao) {
        filtros.tipoTransacao = tipoTransacao;
      }
  
      const relatorio = await prisma.historicoTransacao.findMany({
        where: filtros,
        include: {
          usuario: { select: { nome: true, matricula: true } },
          responsavel: { select: { nome: true } },
        },
        orderBy: { dataTransacao: 'desc' },
      });
  
      if (!relatorio.length) {
        return reply.code(404).send({ message: 'Nenhum dado encontrado.' });
      }
  
      return reply.code(200).send({ relatorio });
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      return reply.code(500).send({ message: 'Erro ao gerar relatório.' });
    }
  }
};

module.exports = usuarioController;
