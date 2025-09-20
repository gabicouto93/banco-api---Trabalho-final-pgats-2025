// Servidor Express para testes GraphQL mockados
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('../../graphql/schema');

async function createTestGraphQLServer() {
  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });
  return app;
}

module.exports = createTestGraphQLServer;
