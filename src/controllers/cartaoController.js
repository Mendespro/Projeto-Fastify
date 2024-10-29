const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cartaoService = require('../services/cartaoService');

const cartaoController = {
  async criarCartao(request, reply) {
    try {
      const { numeroCartao, matricula } = request.body;
      const cartao = await cartaoService.criarCartao(numeroCartao, matricula);
      return reply.code(201).send(cartao);
    } catch (error) {
      return reply.code(500).send({
        error: error.message || 'Erro ao criar cartão'
      });
    }
  },

  async bloquearCartao(request, reply) {
    const { id } = request.params;
    const cartao = await prisma.cartao.update({
      where: { id: parseInt(id) },
      data: { status: 'bloqueado' },
    });
    return reply.code(200).send({ message: 'Cartão bloqueado com sucesso', cartao });
  },

  async desbloquearCartao(request, reply) {
    const { id } = request.params;
    const cartao = await prisma.cartao.update({
      where: { id: parseInt(id) },
      data: { status: 'ativo' },
    });
    return reply.code(200).send({ message: 'Cartão desbloqueado com sucesso', cartao });
  },

  async buscarCartaoPorNumero(request, reply) {
    try {
      const { numeroCartao } = request.params;
      const cartao = await cartaoService.buscarCartao(numeroCartao);
      if (!cartao) {
        return reply.code(404).send({ error: 'Cartão não encontrado' });
      }
      return reply.send(cartao);
    } catch (error) {
      return reply.code(500).send({ error: 'Erro ao buscar cartão' });
    }
  }
};

module.exports = cartaoController;
