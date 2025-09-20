// Teste de integração REST com mock do service usando Sinon
const request = require('supertest');
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const app = require('../../rest/app');
const contaService = require('../../src/services/contaService');
const gerarTokenTeste = require('../utils/gerarTokenTeste');
let server;

describe('API REST - Contas (mock)', () => {
  before((done) => {
    server = app.listen(0, done);
  });
  after((done) => {
    server.close(done);
    sinon.restore();
  });

  it('GET /contas/:id deve retornar uma conta mockada', async () => {
    sinon.stub(contaService, 'getContaById').resolves({ id: 1, nome: 'Mockada' });
    const token = gerarTokenTeste();
    const res = await request(server)
      .get('/contas/1')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal({ id: 1, nome: 'Mockada' });
  });
});
