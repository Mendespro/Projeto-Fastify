const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/app');

describe('Autenticação Mútua', () => {
  it('deve permitir acesso com autenticação válida', async () => {
    const response = await request(app)
      .post('/transacao/acesso')
      .send({
        hashCartao: 'hashValido123',
        leitorId: 'leitor123',
        timestamp: new Date().toISOString(),
      });

    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal('Acesso permitido');
  });

  it('deve negar acesso com hash inválido', async () => {
    const response = await request(app)
      .post('/transacao/acesso')
      .send({
        hashCartao: 'hashInvalido456',
        leitorId: 'leitor123',
        timestamp: new Date().toISOString(),
      });

    expect(response.status).to.equal(403);
    expect(response.body.error).to.equal('Cartão inválido ou bloqueado.');
  });

  it('deve rejeitar mensagens com timestamps reutilizados', async () => {
    const timestamp = new Date().toISOString();

    await request(app)
      .post('/transacao/acesso')
      .send({
        hashCartao: 'hashValido123',
        leitorId: 'leitor123',
        timestamp,
      });

    const response = await request(app)
      .post('/transacao/acesso')
      .send({
        hashCartao: 'hashValido123',
        leitorId: 'leitor123',
        timestamp,
      });

    expect(response.status).to.equal(403);
    expect(response.body.error).to.equal('Mensagem já usada');
  });

  it('deve registrar o acesso e atualizar o timestamp do cartão', async () => {
    const response = await request(app)
      .post('/transacao/acesso')
      .send({
        hashCartao: 'hashValido123',
        leitorId: 'leitor123',
        timestamp: new Date().toISOString(),
      });
  
    expect(response.status).to.equal(200);
    expect(response.body.acesso.permitido).to.equal(true);
  
    const cartaoAtualizado = await prisma.cartao.findUnique({
      where: { hashCartao: 'hashValido123' },
    });
  
    expect(new Date(cartaoAtualizado.ultimoTimestamp)).to.be.above(new Date('2024-11-19T00:00:00Z'));
  });
});
