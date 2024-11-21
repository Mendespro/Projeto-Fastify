const { expect } = require('chai');
const request = require('supertest');
const app = require('../app');

describe('Registrar Acesso', () => {
  it('deve registrar acesso com autenticação mútua válida', async () => {
    const res = await request(app)
      .post('/transacao/acesso')
      .send({
        hashCartao: 'hashValido123',
        leitorId: 'leitor123',
        timestamp: new Date().toISOString(),
      });

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Acesso permitido');
  });

  it('deve rejeitar mensagens com timestamps reutilizados', async () => {
    const timestamp = new Date().toISOString();

    await request(app)
      .post('/transacao/acesso')
      .send({ hashCartao: 'hashValido123', leitorId: 'leitor123', timestamp });

    const res = await request(app)
      .post('/transacao/acesso')
      .send({ hashCartao: 'hashValido123', leitorId: 'leitor123', timestamp });

    expect(res.status).to.equal(403);
    expect(res.body.error).to.equal('Mensagem já usada');
  });
});