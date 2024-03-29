import { ApolloServer } from "@apollo/server";
import authMiddleware from "./src/middleware/auth.js";
import express from "express";
import resolvers from "./src/graphql/resolvers/index.js";
import pkg from "mongoose";
import gql from "graphql-tag";
import fs from "fs";
import { startStandaloneServer } from '@apollo/server/standalone'
import "dotenv/config";

const { connect } = pkg;

const typeDefs = gql(
  fs.readFileSync("./src/graphql/schema/typeDefs.graphql", "utf-8")
);

const MONGODB = process.env.DB_URI || "mongodb+srv://cristianpaez009:pRURi8SB4f8JknFr@apolloserversetup.mdtll1a.mongodb.net/?retryWrites=true&w=majority";

const app = express();

const port = Number.parseInt(process.env.PORT) || 4000;


app.use(authMiddleware);
await connect(MONGODB);
console.log("MongoDB Connected");

const server = new ApolloServer({ typeDefs, resolvers,  });
const { url } = await startStandaloneServer(server, {
  context: async ({ req }) => ({ token: req.headers.token }),
  listen: { port },
});
console.log(`🚀  Server ready at ${url}`);