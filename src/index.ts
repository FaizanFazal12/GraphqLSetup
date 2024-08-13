import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

// Sample typeDefs and resolvers
const typeDefs = `
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};

async function Init() {
  const app = express();
  app.use(express.json());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  // Use the expressMiddleware for /graphql endpoint
  app.use('/graphql', expressMiddleware(server));

  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log('Connected to the port ' + PORT);
  });
}

Init();
