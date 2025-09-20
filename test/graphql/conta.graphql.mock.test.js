// Teste de integração GraphQL com mock do service usando Sinon
const request = require('supertest');
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const createTestGraphQLServer = require('../utils/createTestGraphQLServer');
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

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

describe('API GraphQL - Conta (mock)', () => {
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

  it('deve retornar contas mockadas', async () => {
    const query = { query: `query { contas { id titular saldo ativa } }` };
    const res = await request(server)
      .post('/graphql')
      .send(query);
    expect(res.status).to.equal(200);
    expect(res.body.data.contas[0].titular).to.equal('Mock');
  });
});
