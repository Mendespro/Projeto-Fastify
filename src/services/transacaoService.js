const prisma = require('../config/database');
const { generateCardHash } = require('../utils/hash');
const { randomBytes, createHash } = require('crypto');
const leitoresAutorizados = ['leitor_001', 'leitor_002', 'leitor_003', 'leitor123'];

const transacaoService = {
  async realizarAutenticacaoMutua(cartaoHash, leitorId) {
    if (!leitoresAutorizados.includes(leitorId)) {
      throw new Error('Leitor não autorizado.');
    }

    const timestamp = new Date().toISOString();
    const randomString = randomBytes(16).toString('hex');
    const servidorHash = createHash('sha256').update(`${leitorId}${timestamp}${randomString}`).digest('hex');

    const cartao = await prisma.cartao.findUnique({
      where: { hashCartao: cartaoHash },
      include: { usuario: true },
    });

    if (!cartao || cartao.status !== 'ATIVO') {
      throw new Error('Cartão inválido ou bloqueado.');
    }

    const autenticacaoValida = cartaoHash === cartao.hashCartao;
    
    if (!autenticacaoValida) {
      throw new Error('Falha na autenticação mútua.');
    }

    const novoHashCartao = createHash('sha256').update(`${cartao.hashCartao}${timestamp}${randomString}`).digest('hex');
    
    await prisma.cartao.update({
      where: { id: cartao.id },
      data: {
        hashCartao: novoHashCartao, 
        leitorId: leitorId, 
      },
    });

    return { autenticado: true, cartao, timestamp, novoHashCartao };
  },

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
    if (!cartaoId) {
      throw new Error('ID do cartão é obrigatório para realizar a transação.');
    }
  
    if (!['REFEICAO', 'DEPOSITO'].includes(tipoTransacao)) {
      throw new Error('Tipo de transação inválido.');
    }
  
    return prisma.$transaction(async (tx) => {
      const cartao = await tx.cartao.findUnique({
        where: { id: cartaoId }, // Validação garantida pelo Prisma
        include: { usuario: true },
      });
  
      if (!cartao) {
        throw new Error('Cartão não encontrado.');
      }
  
      if (tipoTransacao === 'REFEICAO' && cartao.usuario.saldo < valor) {
        throw new Error('Saldo insuficiente.');
      }
  
      const transacao = await tx.historicoTransacao.create({
        data: {
          tipoTransacao,
          valor,
          idUsuario: cartao.idUsuario,
        },
      });
  
      const saldoUpdate = tipoTransacao === 'REFEICAO' ? { decrement: valor } : { increment: valor };
  
      await tx.usuario.update({
        where: { id: cartao.idUsuario },
        data: { saldo: saldoUpdate },
      });
  
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

module.exports = {transacaoService};
