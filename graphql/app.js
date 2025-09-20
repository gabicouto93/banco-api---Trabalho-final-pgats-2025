require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const { typeDefs, resolvers } = require('./schema');

function createApolloServer() {
  return new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req }),
  });
}

if (require.main === module) {
  const server = createApolloServer();
  server.listen({ port: process.env.GRAPHQLPORT || 4000 }).then(({ url }) => {
    console.log(`Servidor GraphQL rodando em ${url}`);
  });
}

module.exports = createApolloServer;
