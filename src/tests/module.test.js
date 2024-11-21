const { expect } = require('chai');

describe('Verificar Importação', () => {
  it('Deve importar preventReplay sem erros', () => {
    const preventReplay = require('../middleware/preventReplay');
    expect(preventReplay).to.be.a('function');
  });
});
