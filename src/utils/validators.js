const validarEntradaTransacao = (cartaoId, timestamp, tipoTransacao) => {
  if (!cartaoId || !timestamp || !['REFEICAO', 'DEPOSITO'].includes(tipoTransacao)) {
    throw new Error('Dados inválidos para transação');
  }
};
  
module.exports = { validarEntradaTransacao };
