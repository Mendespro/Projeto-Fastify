const { createHash } = require('crypto');
const bcrypt = require('bcrypt');

// Função para gerar o hash do cartão usando a matrícula e a data
const generateCardHash = (matricula) => {
  const timestamp = new Date().toISOString().slice(0, 10);
  return createHash('sha256').update(`${matricula}${timestamp}`).digest('hex');
};

// Função para criptografar senhas de forma segura
const hashPassword = (senha) => {
  const saltRounds = 10;
  return bcrypt.hashSync(senha, saltRounds);
};

module.exports = { generateCardHash, hashPassword };
