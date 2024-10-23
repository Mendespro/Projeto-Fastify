const { PrismaClient } = require('@prisma/client');
const { generateCardHash } = require('../utils/hash');

const prisma = new PrismaClient();

const acessoService = {
  async validarAcesso(numeroCartao, matricula, tipoRefeicao) {
    try {
      // Gera hash atual do cartão
      const hashAtual = generateCardHash(numeroCartao, matricula);
      
      // Busca cartão com hash atual e status ativo
      const cartao = await prisma.cartao.findFirst({
        where: {
          hashCartao: hashAtual,
          status: 'ATIVO',
        },
        include: {
          usuario: true,
        },
      });

      if (!cartao) {
        throw new Error('Cartão inválido ou não encontrado');
      }

      if (cartao.status === 'BLOQUEADO') {
        throw new Error('Cartão bloqueado');
      }

      const valorRefeicao = 2.50; // Valor fixo para exemplo

      if (cartao.usuario.saldo < valorRefeicao) {
        throw new Error('Saldo insuficiente');
      }

      return { cartao, valorRefeicao };
    } catch (error) {
      throw new Error(`Erro na validação de acesso: ${error.message}`);
    }
  },

  async registrarAcesso(cartao, valorRefeicao, tipoRefeicao) {
    try {
      return await prisma.$transaction(async (tx) => {
        // Registra a refeição
        const refeicao = await tx.refeicao.create({
          data: {
            tipoRefeicao,
            valorRefeicao,
            idUsuario: cartao.idUsuario,
          },
        });

        // Registra o acesso
        const acesso = await tx.acesso.create({
          data: {
            idCartao: cartao.id,
            permitido: true,
          },
        });

        // Atualiza o saldo do usuário
        await tx.usuario.update({
          where: { id: cartao.idUsuario },
          data: {
            saldo: {
              decrement: valorRefeicao,
            },
          },
        });

        // Registra a transação no histórico
        await tx.historicoTransacao.create({
          data: {
            tipoTransacao: 'REFEICAO',
            valor: valorRefeicao,
            idUsuario: cartao.idUsuario,
          },
        });

        return {
          refeicao,
          acesso,
          mensagem: 'Acesso registrado com sucesso',
        };
      });
    } catch (error) {
      throw new Error(`Erro ao registrar acesso: ${error.message}`);
    }
  },
};
