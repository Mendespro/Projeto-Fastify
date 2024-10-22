const { prisma } = require('../prisma');
const { createHash } = require('crypto');

const restauranteController = {
  // Registrar refeição e controlar acesso
  async registrarAcesso(request, reply) {
    const { numeroCartao, tipoRefeicao } = request.body;

    try {
      const cartao = await prisma.cartao.findUnique({
        where: { numeroCartao },
        include: { usuario: true }
      });

      // Verificar se cartão existe e está ativo
      if (!cartao || cartao.status === 'BLOQUEADO') {
        return reply.code(403).send({
          error: 'Cartão inválido ou bloqueado'
        });
      }

      // Verificar se usuário tem saldo suficiente
      const valorRefeicao = tipoRefeicao === 'ALMOCO' ? 2.50 : 2.50; // Exemplo de valor
      if (cartao.usuario.saldo < valorRefeicao) {
        return reply.code(403).send({
          error: 'Saldo insuficiente'
        });
      }

      // Criar transação para garantir consistência
      const resultado = await prisma.$transaction(async (prisma) => {
        // Registrar refeição
        const refeicao = await prisma.refeicao.create({
          data: {
            tipoRefeicao,
            valorRefeicao,
            usuario: {
              connect: { id: cartao.idUsuario }
            }
          }
        });

        // Debitar saldo
        await prisma.usuario.update({
          where: { id: cartao.idUsuario },
          data: { saldo: { decrement: valorRefeicao } }
        });

        // Registrar histórico
        await prisma.historicoTransacao.create({
          data: {
            tipoTransacao: 'REFEICAO',
            valor: valorRefeicao,
            usuario: {
              connect: { id: cartao.idUsuario }
            }
          }
        });

        // Registrar acesso
        await prisma.acesso.create({
          data: {
            permitido: true,
            cartao: {
              connect: { id: cartao.id }
            }
          }
        });

        return refeicao;
      });

      return reply.code(200).send({
        message: 'Acesso autorizado',
        refeicao: resultado
      });

    } catch (error) {
      console.error(error);
      return reply.code(500).send({
        error: 'Erro ao processar acesso'
      });
    }
  },

  // Realizar recarga de saldo
  async realizarRecarga(request, reply) {
    const { numeroCartao, valor } = request.body;

    try {
      const cartao = await prisma.cartao.findUnique({
        where: { numeroCartao },
        include: { usuario: true }
      });

      if (!cartao) {
        return reply.code(404).send({
          error: 'Cartão não encontrado'
        });
      }

      const deposito = await prisma.$transaction(async (prisma) => {
        // Registrar depósito
        const deposito = await prisma.deposito.create({
          data: {
            valorDeposito: valor,
            usuario: {
              connect: { id: cartao.idUsuario }
            }
          }
        });

        // Atualizar saldo
        await prisma.usuario.update({
          where: { id: cartao.idUsuario },
          data: { saldo: { increment: valor } }
        });

        // Registrar histórico
        await prisma.historicoTransacao.create({
          data: {
            tipoTransacao: 'DEPOSITO',
            valor,
            usuario: {
              connect: { id: cartao.idUsuario }
            }
          }
        });

        return deposito;
      });

      return reply.code(200).send({
        message: 'Recarga realizada com sucesso',
        deposito
      });

    } catch (error) {
      console.error(error);
      return reply.code(500).send({
        error: 'Erro ao realizar recarga'
      });
    }
  },

  // Bloquear cartão
  async bloquearCartao(request, reply) {
    const { numeroCartao, motivo } = request.body;

    try {
      const cartao = await prisma.cartao.findUnique({
        where: { numeroCartao }
      });

      if (!cartao) {
        return reply.code(404).send({
          error: 'Cartão não encontrado'
        });
      }

      await prisma.$transaction([
        prisma.cartao.update({
          where: { id: cartao.id },
          data: { status: 'BLOQUEADO' }
        }),
        prisma.bloqueioCartao.create({
          data: {
            motivoBloqueio: motivo,
            cartao: {
              connect: { id: cartao.id }
            }
          }
        })
      ]);

      return reply.code(200).send({
        message: 'Cartão bloqueado com sucesso'
      });

    } catch (error) {
      console.error(error);
      return reply.code(500).send({
        error: 'Erro ao bloquear cartão'
      });
    }
  },

  // Gerar relatório de transações
  async gerarRelatorio(request, reply) {
    const { dataInicio, dataFim } = request.query;

    try {
      const transacoes = await prisma.historicoTransacao.findMany({
        where: {
          dataTransacao: {
            gte: new Date(dataInicio),
            lte: new Date(dataFim)
          }
        },
        include: {
          usuario: {
            select: {
              nome: true,
              matricula: true
            }
          }
        },
        orderBy: {
          dataTransacao: 'desc'
        }
      });

      return reply.code(200).send({
        transacoes
      });

    } catch (error) {
      console.error(error);
      return reply.code(500).send({
        error: 'Erro ao gerar relatório'
      });
    }
  }
};

module.exports = restauranteController;