const { expect } = require('chai');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { startServer, stopServer } = require('../testServer');

let app;

before(async () => {
  app = await startServer();
});

after(async () => {
  await stopServer();
});

describe('Testes de Transações', () => {
  it('Deve rejeitar requisições duplicadas (Replay Attack)', async () => {
    const token = jwt.sign(
      { id: 15, role: 'FUNCIONARIO' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const body = {
      hashCartao: '8814a03ee89decd809b741ec680894126ccb3dfded036cc62123f38507b7c806',
      leitorId: 'leitor123',
      timestamp: Date.now(),
    };

    const primeira = await request(app.server)
      .post('/transacao/acesso')
      .set('Authorization', `Bearer ${token}`)
      .send(body);

    expect(primeira.status).to.equal(200);

    const segunda = await request(app.server)
      .post('/transacao/acesso')
      .set('Authorization', `Bearer ${token}`)
      .send(body);

    expect(segunda.status).to.equal(403);
    expect(segunda.body.error).to.equal('Mensagem já usada');
  });
});
