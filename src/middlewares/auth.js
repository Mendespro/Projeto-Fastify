const jwt = require('jsonwebtoken');
const { validarCartao, verificarHash } = require('../services/transacaoService');

// Middleware para autenticação com comunicação com hardware
module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = decoded;

    // Caso seja uma rota de acesso, realizar verificação adicional com hardware
    if (req.path.includes('/acesso')) {
      const { numeroCartao } = req.body;
      const cartaoValido = await validarCartao(numeroCartao);

      if (!cartaoValido || !verificarHash(numeroCartao)) {
        return res.status(403).json({ message: 'Acesso negado. Cartão inválido.' });
      }
    }

    // Comunicação com hardware (simulado aqui)
    enviarParaHardware(req.userData, req.body); // Enviar dados para dispositivo

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Autenticação falhou' });
  }
};

// Função que simula o envio de dados ao hardware
function enviarParaHardware(userData, requestData) {
  console.log("Enviando dados para hardware:", { userData, requestData });
  // Lógica de comunicação com hardware (ex: enviar dados via socket)
}
