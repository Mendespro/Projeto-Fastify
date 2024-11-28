const lastTimestamps = {};

const preventReplay = async (request, reply, next) => {
  try {
    const { hashCartao, timestamp } = request.body;

    if (!hashCartao || !timestamp) {
      return reply.code(400).send({ error: 'Campos obrigatórios ausentes' });
    }

    if (lastTimestamps[hashCartao] && lastTimestamps[hashCartao] >= timestamp) {
      return reply.code(403).send({ error: 'Mensagem já usada' });
    }

    lastTimestamps[hashCartao] = timestamp;

    next(); 
  } catch (error) {
    console.error('Erro no middleware preventReplay:', error.message);
    return reply.code(500).send({ error: 'Erro interno no middleware' });
  }
};

module.exports = preventReplay;
