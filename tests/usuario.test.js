const { expect } = require('chai');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { startServer, stopServer } = require('../testServer');
const FormData = require('form-data');

let app;

before(async () => {
  app = await startServer();
});

after(async () => {
  await stopServer();
});

describe('Testes de Usuários', () => {
  it('Deve rejeitar cadastro com matrícula duplicada', async () => {
    const token = jwt.sign({ id: 38, role: 'FUNCIONARIO' }, process.env.JWT_SECRET);
  
    const form = new FormData();
    form.append('nome', 'Usuário Testehjgkkl');
    form.append('matricula', '1234567997');
    form.append('email', 'testeh987@teste.com');
    form.append('role', 'ALUNO');
  
    const headers = {
      ...form.getHeaders(),
      Authorization: `Bearer ${token}`,
    };
  
    const primeira = await request(app.server)
      .post('/usuarios')
      .set(headers)
      .send(form.getBuffer());

    expect(primeira.status).to.equal(201);

    const segunda = await request(app.server)
      .post('/usuarios')
      .set(headers)
      .send(form.getBuffer());

    expect(segunda.status).to.equal(400);
    expect(segunda.body.error).to.equal('Matrícula ou email já cadastrados.');
  });
});
