let lastTimestamps = {};

const preventReplay = (request, reply, next) => {
  const { timestamp, cartaoId } = request.body;

  if (lastTimestamps[cartaoId] && lastTimestamps[cartaoId] >= timestamp) {
    return reply.code(403).send({ error: 'Mensagem já usada' });
  }

  lastTimestamps[cartaoId] = timestamp;
  next();
};

module.exports = preventReplay;
