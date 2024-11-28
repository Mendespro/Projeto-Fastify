const { expect } = require('chai');
const request = require('supertest');
const { startServer, stopServer } = require('../testServer');

let app;

before(async () => {
  app = await startServer();
});

after(async () => {
  await stopServer();
});

describe('Testes de Autenticação', () => {
  it('Deve rejeitar token inválido', async () => {
    const res = await request(app.server)
      .get('/usuarios/relatorio')
      .set('Authorization', 'Bearer token_invalido');

    expect(res.status).to.equal(401);
    expect(res.body.message).to.equal('Autenticação falhou');
  });
});
