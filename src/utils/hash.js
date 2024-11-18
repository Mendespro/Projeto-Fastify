const { createHash } = require('crypto');
const bcrypt = require('bcrypt');

const generateCardHash = (matricula) => {
  const timestamp = new Date().toISOString().slice(0, 10);
  return createHash('sha256').update(`${matricula}${timestamp}`).digest('hex');
};

const hashPassword = (senha) => {
  const saltRounds = 10;
  return bcrypt.hashSync(senha, saltRounds);
};

module.exports = { generateCardHash, hashPassword };
