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
    try {
      const { numeroCartao, motivo } = request.body;
      
      const cartao = await cartaoService.bloquearCartao(numeroCartao, motivo);
      
      return reply.code(200).send({
        message: 'Cartão bloqueado com sucesso',
        cartao
      });
    } catch (error) {
      return reply.code(500).send({
        error: error.message || 'Erro ao bloquear cartão'
      });
    }
  },

  async buscarCartaoPorNumero(request, reply) {
    try {
      const { numeroCartao } = request.params;
      
      const cartao = await cartaoService.buscarCartao(numeroCartao);
      
      if (!cartao) {
        return reply.code(404).send({
          error: 'Cartão não encontrado'
        });
      }
      
      return reply.send(cartao);
    } catch (error) {
      return reply.code(500).send({
        error: 'Erro ao buscar cartão'
      });
    }
  }
};