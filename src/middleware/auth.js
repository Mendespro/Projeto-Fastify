const jwt = require('jsonwebtoken');
const { validarCartao, verificarHash } = require('../services/transacaoService');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = decoded;

    if (req.path.includes('/acesso')) {
      const { numeroCartao } = req.body;
      const cartaoValido = await validarCartao(numeroCartao);

      if (!cartaoValido || !verificarHash(numeroCartao)) {
        return res.status(403).json({ message: 'Acesso negado. Cartão inválido.' });
      }
    }

    enviarParaHardware(req.userData, req.body);
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Autenticação falhou' });
  }
};

function enviarParaHardware(userData, requestData) {
  console.log("Enviando dados para hardware:", { userData, requestData });
}
