import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { prismaClient } from './lib/db';

// Sample typeDefs and resolvers
const typeDefs = `
  type Query {
    hello: String
    say(name:String):String
  }
    type Mutation{
    createUser(firstName: String!, lastName: String! , email:String! , password:String!): Boolean
    }

`;

const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    say: (_: any, { name }: { name: string }): string => `Hello, how are you ${name}?`,
  },
  Mutation: {
    createUser: async (_: any, { firstName, lastName, email, password }: { firstName: string; lastName: string; email: string; password: string; }) => {
      const newUser = await prismaClient.user.create({
        data: {
          firstName,
          lastName,
          email,
          password,
          salt: 'demo salt', // If you intend to pass 'salt' from the arguments
        },
      });
      console.log(newUser)
      return true; // Returning the newly created user object
    },
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

  const PORT = process.env.PORT || 8001;
  app.listen(PORT, () => {
    console.log('Connected to the port ' + PORT);
  });
}

Init();
