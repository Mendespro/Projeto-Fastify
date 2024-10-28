const depositoService = require('../services/depositoService');

const depositoController = {
  async realizarDeposito(request, reply) {
    try {
      const { matricula, valor } = request.body;
      
      const resultado = await depositoService.realizarDeposito(matricula, valor);
      
      return reply.code(201).send(resultado);
    } catch (error) {
      return reply.code(500).send({
        error: error.message || 'Erro ao realizar depósito'
      });
    }
  },

  async buscarDepositos(request, reply) {
    try {
      const { matricula } = request.params;
      const { dataInicio, dataFim } = request.query;
      
      const depositos = await depositoService.buscarDepositos(matricula, dataInicio, dataFim);
      
      return reply.send(depositos);
    } catch (error) {
      return reply.code(500).send({
        error: 'Erro ao buscar depósitos'
      });
    }
  }
};