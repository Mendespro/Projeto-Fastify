const transacaoService = require('../services/transacaoService');
const { validarEntradaTransacao } = require('../utils/validators');

const transacaoController = {
  async registrarAcesso(request, reply) {
    try {
      const { numeroCartao, matricula, tipoTransacao } = request.body;
      const valor = tipoTransacao === 'REFEICAO' ? 2.5 : 0;
      
      validarEntradaTransacao(numeroCartao, matricula, valor);

      const cartao = await transacaoService.validarCartao(numeroCartao, matricula);
      const resultado = await transacaoService.registrarTransacao(cartao.id, tipoTransacao, valor);

      return reply.code(200).send({ message: 'Acesso autorizado', resultado });
    } catch (error) {
      return reply.code(500).send({ error: error.message });
    }
  },

  async realizarRecarga(request, reply) {
    try {
      const { numeroCartao, matricula, valor } = request.body;
      
      // Validação e registro da recarga
      const cartao = await transacaoService.validarCartao(numeroCartao, matricula);
      const resultado = await transacaoService.registrarTransacao(cartao.id, 'DEPOSITO', valor);

      return reply.code(200).send({ message: 'Recarga realizada com sucesso', resultado });
    } catch (error) {
      return reply.code(500).send({ error: error.message });
    }
  },

  async bloquearCartao(request, reply) {
    try {
      const { numeroCartao, motivo } = request.body;
      
      // Validação e bloqueio do cartão
      const cartao = await transacaoService.validarCartao(numeroCartao);
      const resultado = await transacaoService.bloquearCartao(cartao.id, motivo);

      return reply.code(200).send({ message: 'Cartão bloqueado com sucesso', resultado });
    } catch (error) {
      return reply.code(500).send({ error: error.message });
    }
  },

  async gerarRelatorio(request, reply) {
    try {
      const { dataInicio, dataFim } = request.query;
      
      // Geração do relatório com base no intervalo fornecido
      const relatorio = await transacaoService.gerarRelatorio(dataInicio, dataFim);

      return reply.code(200).send({ relatorio });
    } catch (error) {
      return reply.code(500).send({ error: error.message });
    }
  }
};

module.exports = transacaoController;