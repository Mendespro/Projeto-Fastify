const validarEntradaTransacao = (matricula, valor) => {
    if (!matricula || typeof valor !== 'number' || valor < 0) {
      throw new Error('Dados inválidos para transação');
    }
  };
  
  const validarEntradaUsuario = (nome, matricula, senha) => {
    if (!nome || !matricula || !senha) {
      throw new Error('Dados de usuário incompletos');
    }
  };
  
  module.exports = { validarEntradaTransacao, validarEntradaUsuario };
  