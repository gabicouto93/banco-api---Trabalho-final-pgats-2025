// Teste unitário de Controller (contaController) usando Mocha, Chai e Sinon
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const contaController = require('../../rest/controllers/contaController');
const contaService = require('../../src/services/contaService');

function mockResponse() {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  return res;
}

describe('ContaController', () => {
  afterEach(() => sinon.restore());

  it('deve retornar conta ao buscar por ID', async () => {
    const req = { params: { id: 1 } };
    const res = mockResponse();
    sinon.stub(contaService, 'getContaById').resolves({ id: 1, nome: 'Teste' });
    await contaController.getConta(req, res);
    expect(res.json.calledWith({ id: 1, nome: 'Teste' })).to.be.true;
  });

  it('deve retornar erro se service lançar exceção', async () => {
    const req = { params: { id: 999 } };
    const res = mockResponse();
    const next = sinon.stub();
    sinon.stub(contaService, 'getContaById').rejects(new Error('Conta não encontrada'));
    await contaController.getConta(req, res, next);
    expect(next.calledOnce).to.be.true;
    expect(next.firstCall.args[0]).to.be.an('error');
    expect(next.firstCall.args[0].message).to.equal('Conta não encontrada');
  });
});
