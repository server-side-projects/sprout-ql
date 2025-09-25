/* node modules */
import axios from "axios";
import dotenv from "dotenv";
import { ruruHTML } from "ruru/server";
import { createHandler } from "graphql-http/lib/use/express";
import { makeExecutableSchema } from "@graphql-tools/schema";

/* app imports */
dotenv.config();
import { AppQueries } from "./resolvers/queries/index.js";
import { AppMutations } from "./resolvers/mutations/index.js";
import generateTypeDefinitions from "./schemas/create-type-definitions.js";

/* module */
function appRoutes(app) {
  const typeDefs = generateTypeDefinitions();
  const resolvers = {
    Query: AppQueries,
    Mutation: AppMutations,
    APIResponse: {
      __resolveType: (res) => {
        if ("schemaType" in res && res.schemaType) {
          return res.schemaType;
        } else {
          return null;
        }
      },
    },
  };
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  app.all(
    "/graphql",
    createHandler({
      schema,
    })
  );

  app.get("/", (req, res) => {
    res.type("html");
    res.end(ruruHTML({ endpoint: "/graphql" }));
  });
}

/* exports */
export default appRoutes;
