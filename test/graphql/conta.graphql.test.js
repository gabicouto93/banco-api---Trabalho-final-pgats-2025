// Teste de integração GraphQL usando Supertest, Mocha e Chai
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;

const typeDefs = gql`
  type Conta {
    id: Int
    titular: String
    saldo: Float
    ativa: Boolean
  }
  type Query {
    contas: [Conta]
  }
`;

const resolvers = {
  Query: {
    contas: () => [ { id: 1, titular: 'Mock', saldo: 100, ativa: true } ]
  }
};

let app, server;

describe('API GraphQL - Conta', () => {
  before(async () => {
    app = express();
    const apolloServer = new ApolloServer({ typeDefs, resolvers });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, path: '/graphql' });
    server = app.listen(0);
  });
  after(async () => {
    server.close();
  });

  it('deve retornar todas as contas', async () => {
    const query = { query: `query { contas { id titular saldo ativa } }` };
    const res = await request(server)
      .post('/graphql')
      .send(query);
    expect(res.status).to.equal(200);
    expect(res.body.data.contas).to.be.an('array');
    expect(res.body.data.contas[0].titular).to.equal('Mock');
  });

  it('deve retornar array vazio se não houver contas', async () => {
    const emptyResolvers = {
      Query: { contas: () => [] }
    };
    const appEmpty = express();
    const apolloServerEmpty = new ApolloServer({ typeDefs, resolvers: emptyResolvers });
    await apolloServerEmpty.start();
    apolloServerEmpty.applyMiddleware({ app: appEmpty, path: '/graphql' });
    const serverEmpty = appEmpty.listen(0);
    const query = { query: `query { contas { id titular saldo ativa } }` };
    const res = await request(serverEmpty)
      .post('/graphql')
      .send(query);
    expect(res.status).to.equal(200);
    expect(res.body.data.contas).to.be.an('array').that.is.empty;
    serverEmpty.close();
  });

  it('deve retornar saldo correto da conta mockada', async () => {
    const query = { query: `query { contas { saldo } }` };
    const res = await request(server)
      .post('/graphql')
      .send(query);
    expect(res.status).to.equal(200);
    expect(res.body.data.contas[0].saldo).to.equal(100);
  });

  it('deve retornar campo ativa como true', async () => {
    const query = { query: `query { contas { ativa } }` };
    const res = await request(server)
      .post('/graphql')
      .send(query);
    expect(res.status).to.equal(200);
    expect(res.body.data.contas[0].ativa).to.be.true;
  });

  it('deve retornar id como inteiro', async () => {
    const query = { query: `query { contas { id } }` };
    const res = await request(server)
      .post('/graphql')
      .send(query);
    expect(res.status).to.equal(200);
    expect(res.body.data.contas[0].id).to.be.a('number');
  });

  it('deve retornar titular correto', async () => {
    const query = { query: `query { contas { titular } }` };
    const res = await request(server)
      .post('/graphql')
      .send(query);
    expect(res.status).to.equal(200);
    expect(res.body.data.contas[0].titular).to.equal('Mock');
  });

  it('deve retornar null para campo inexistente', async () => {
    const query = { query: `query { contas { inexistente } }` };
    const res = await request(server)
      .post('/graphql')
      .send(query);
    // Aceita status 200 ou 400, dependendo do Apollo
    expect([200, 400]).to.include(res.status);
    // Se status 400, espera erro no body
    if (res.status === 400) {
      expect(res.body.errors).to.be.an('array');
    } else {
      expect(res.body.data.contas[0].inexistente).to.be.undefined;
    }
  });

  it('deve retornar erro para query inválida', async () => {
    const query = { query: `query { contas { id nomeInvalido } }` };
    const res = await request(server)
      .post('/graphql')
      .send(query);
    expect(res.body.errors).to.be.an('array');
    // Aceita data null ou undefined
    expect(res.body.data === null || res.body.data === undefined).to.be.true;
  });

  it('deve retornar status 200 mesmo sem autenticação', async () => {
    const query = { query: `query { contas { id } }` };
    const res = await request(server)
      .post('/graphql')
      .send(query);
    expect(res.status).to.equal(200);
  });

  it('deve retornar todas as propriedades da conta mockada', async () => {
    const query = { query: `query { contas { id titular saldo ativa } }` };
    const res = await request(server)
      .post('/graphql')
      .send(query);
    const conta = res.body.data.contas[0];
    expect(conta).to.have.all.keys('id', 'titular', 'saldo', 'ativa');
  });

  it('deve retornar mais de uma conta se mock alterado', async () => {
    const multiResolvers = {
      Query: {
        contas: () => [
          { id: 1, titular: 'Mock', saldo: 100, ativa: true },
          { id: 2, titular: 'Outro', saldo: 200, ativa: false }
        ]
      }
    };
    const appMulti = express();
    const apolloServerMulti = new ApolloServer({ typeDefs, resolvers: multiResolvers });
    await apolloServerMulti.start();
    apolloServerMulti.applyMiddleware({ app: appMulti, path: '/graphql' });
    const serverMulti = appMulti.listen(0);
    const query = { query: `query { contas { id titular saldo ativa } }` };
    const res = await request(serverMulti)
      .post('/graphql')
      .send(query);
    expect(res.status).to.equal(200);
    expect(res.body.data.contas).to.have.lengthOf(2);
    expect(res.body.data.contas[1].titular).to.equal('Outro');
    serverMulti.close();
  });
});
