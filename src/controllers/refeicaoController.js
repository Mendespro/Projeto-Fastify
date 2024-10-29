const refeicaoService = require('../services/refeicaoService');

const refeicaoController = {
  async buscarRefeicoes(request, reply) {
    try {
      const { dataInicio, dataFim } = request.query;
      
      const refeicoes = await refeicaoService.buscarRefeicoesPorPeriodo(dataInicio, dataFim);
      
      return reply.send(refeicoes);
    } catch (error) {
      return reply.code(500).send({
        error: 'Erro ao buscar refeições'
      });
    }
  },

  async gerarRelatorio(request, reply) {
    try {
      const { dataInicio, dataFim } = request.query;
      
      const relatorio = await refeicaoService.gerarRelatorioRefeicoes(dataInicio, dataFim);
      
      return reply.send(relatorio);
    } catch (error) {
      return reply.code(500).send({
        error: 'Erro ao gerar relatório'
      });
    }
  }
};

module.exports = refeicaoController;
