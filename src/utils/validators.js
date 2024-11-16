const validarEntradaTransacao = (matricula, valor) => {
  if (!matricula || typeof valor !== 'number' || valor < 0) {
    throw new Error('Dados inválidos para transação');
  }
};
  
const validarEntradaUsuario = (nome, matricula, senha, role) => {
  if (!nome || !matricula) {
    throw new Error('Nome e matrícula são obrigatórios.');
  }
  if (role !== 'ALUNO' && !senha) {
    throw new Error('Senha é obrigatória para funcionários e administradores.');
  }
};
  
module.exports = { validarEntradaTransacao, validarEntradaUsuario };
