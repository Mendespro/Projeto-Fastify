const { createHash } = require('crypto');

const generateCardHash = (cardNumber, matricula) => {
  const timestamp = new Date().toISOString().slice(0, 10);
  return createHash('sha256').update(`${cardNumber}${matricula}${timestamp}`).digest('hex');
};

module.exports = { generateCardHash };
