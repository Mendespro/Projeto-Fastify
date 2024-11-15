const prisma = require('../config/database');
const { generateCardHash } = require('../utils/hash');

const transacaoService = {
  async validarCartao(matricula) {
    const hashAtual = generateCardHash(matricula);
    const cartao = await prisma.cartao.findFirst({
      where: { hashCartao: hashAtual, status: 'ATIVO' },
      include: { usuario: true }
    });
    if (!cartao) throw new Error('Cartão inválido ou bloqueado');
    return cartao;
  },

  async registrarTransacao(cartaoId, tipoTransacao, valor) {
    if (!['REFEICAO', 'DEPOSITO'].includes(tipoTransacao)) {
      throw new Error('Tipo de transação inválido');
    }

    return prisma.$transaction(async (tx) => {
      const cartao = await tx.cartao.findUnique({ where: { id: cartaoId }, include: { usuario: true } });
      if (tipoTransacao === 'REFEICAO' && cartao.usuario.saldo < valor) {
        throw new Error('Saldo insuficiente');
      }

      // Registrar transação e atualizar saldo
      const transacao = await tx.historicoTransacao.create({
        data: { tipoTransacao, valor, idUsuario: cartao.idUsuario }
      });

      const saldoUpdate = tipoTransacao === 'REFEICAO' ? { decrement: valor } : { increment: valor };
      await tx.usuario.update({ where: { id: cartao.idUsuario }, data: { saldo: saldoUpdate } });

      return transacao;
    });
  },

  async bloquearCartao(cartaoId, motivo) {
    return prisma.$transaction(async (tx) => {
      await tx.cartao.update({ where: { id: cartaoId }, data: { status: 'BLOQUEADO' } });
      return await tx.bloqueioCartao.create({ data: { idCartao: cartaoId, motivoBloqueio: motivo } });
    });
  },
  
  async gerarRelatorio(dataInicio, dataFim) {
    return await prisma.historicoTransacao.findMany({
      where: { dataTransacao: { gte: new Date(dataInicio), lte: new Date(dataFim) } },
      include: { usuario: { select: { nome: true, matricula: true } } },
      orderBy: { dataTransacao: 'desc' }
    });
  }
};

module.exports = transacaoService;
