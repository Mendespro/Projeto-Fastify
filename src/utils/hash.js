const bcrypt = require('bcrypt');
const { createHash, randomBytes } = require('crypto');

const generateCardHash = (matricula) => {
  const timestamp = new Date().toISOString();
  const randomString = randomBytes(16).toString('hex');
  return createHash('sha256').update(`${matricula}${timestamp}${randomString}`).digest('hex');
};

const hashPassword = (senha) => {
  const saltRounds = 10;
  return bcrypt.hashSync(senha, saltRounds);
};

module.exports = { generateCardHash, hashPassword };
