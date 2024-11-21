const { expect } = require('chai');
const preventReplay = require('../../middleware/preventReplay');

describe('Middleware preventReplay', () => {
  console.log('Caminho do módulo:', require.resolve('../../middleware/preventReplay'));
  it('deve rejeitar requests com timestamp duplicado', async () => {
    const req = { body: { cartaoId: 1, timestamp: '2024-11-20T10:00:00Z' } };
    const res = {
      code: (status) => ({
        send: (message) => {
          throw new Error(`Status ${status}: ${JSON.stringify(message)}`);
        },
      }),
    };
    const next = () => {};

    // Primeira chamada
    preventReplay(req, res, next);

    // Segunda chamada com o mesmo timestamp
    expect(() => preventReplay(req, res, next)).to.throw('Mensagem já usada');
  });
});
