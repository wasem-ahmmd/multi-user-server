import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import bodyParser from "body-parser";
import express from "express";
import { User } from "./user";
import { GraphqlContext } from "../intefaces";
import JWTService from "../services/jwt";

// {
//   origin: "http://localhost:3000/",
//   credentials: true,
// }
export const initServer = async () => {
  const app = express();
  app.use(bodyParser.json());
  app.use(cors());

  app.get("/", (req, res) =>
    res.status(200).json({ message: "EveryThing Is Good" })
  );
  const server = new ApolloServer<GraphqlContext>({
    typeDefs: `
        ${User.typeDefs}
        type Query {
           ${User.queries}
        }
        type Mutation {
            ${User.mutations}
        }
        `,
    resolvers: {
      Query: {
        ...User.resolvers.queries,
      },
      Mutation: {
        ...User.resolvers.mutations,
      },
    },
  });
  await server.start();
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        return {
          user: req.headers.authorization
            ? JWTService.decodeToken(
                req.headers.authorization.split("Bearer ")[1]
              )
            : undefined,
        };
      },
    })
  );
  return app;
};
