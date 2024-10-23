const cartaoService = require('../services/cartaoService');

const acessoController = {
  async registrarAcesso(request, reply) {
    try {
      const { numeroCartao, matricula, tipoRefeicao } = request.body;
      
      const cartao = await cartaoService.validarCartao(numeroCartao, matricula);
      
      if (!cartao) {
        return reply.code(403).send({ error: 'Cartão inválido' });
      }

      const resultado = await cartaoService.registrarAcesso(cartao.id, tipoRefeicao);
      
      return reply.code(200).send({
        message: 'Acesso autorizado',
        ...resultado,
      });
    } catch (error) {
      return reply.code(500).send({
        error: error.message || 'Erro ao processar acesso',
      });
    }
  },
};

module.exports = acessoController;