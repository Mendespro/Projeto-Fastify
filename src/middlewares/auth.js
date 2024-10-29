const jwt = require('jsonwebtoken'); 
const secret = 'seu_secret_jwt';

async function verificarToken(request, reply) {
  try {
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      return reply.code(401).send({ error: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, secret);
    request.user = decoded;

    return true;
  } catch (error) {
    return reply.code(401).send({ error: 'Token inválido' });
  }
}

function verificarAdmin(request, reply, done) {
  if (request.user && request.user.role === 'moderador') {
    done();
  } else {
    reply.code(403).send({ error: 'Acesso negado. Permissões insuficientes.' });
  }
}

function verificarFuncionario(request, reply, done) {
  // Lógica para verificar se o usuário é funcionário
  done(); // Chame done() quando terminar
}

module.exports = { verificarToken, verificarAdmin, verificarFuncionario };
