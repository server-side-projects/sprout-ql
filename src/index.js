/* node modules */
import axios from "axios";
import dotenv from "dotenv";
import { ruruHTML } from "ruru/server";
import { createHandler } from "graphql-http/lib/use/express";
import { makeExecutableSchema } from "@graphql-tools/schema";

/* app imports */
dotenv.config();
import generateTypeDefinitions from "./schemas/create-type-definitions.js";

/* module */
function appRoutes(app) {
  const typeDefs = generateTypeDefinitions();
  const resolvers = {
    Query: {
      getUserById: async (_, props) => {
        /* config */
        const { id } = props;
        const { API_ROOT_URL } = process.env;
        const URL = `${API_ROOT_URL}/users/${id}`;

        /* fetch data */
        try {
          const response = await axios.get(URL);
          const { data } = response;

          /* end */
          return {
            code: "api-ok",
            message: "getUserById: No errors but, check payload in response",
            schemaType: "UserResponse",
            payload: {
              id: data.id,
              name: data.name,
              email: data.email,
              phone: data.phone,
              city: data.address.city,
            },
          };
        } catch (error) {
          console.log(error);
          return {
            code: "api-fail",
            message: "getUserById - something went wrong",
            payload: null,
          };
        }
      },
      getPostById: async (_, props) => {
        /* config */
        const { id } = props;
        const { API_ROOT_URL } = process.env;
        const URL = `${API_ROOT_URL}/posts/${id}`;

        /* fetch data */
        try {
          const response = await axios.get(URL);
          const { data } = response;

          return {
            code: "api-ok",
            message: "getPostById: No errors but check payload for response",
            schemaType: "PostResponse",
            payload: {
              userId: data.userId,
              postId: data.id,
              title: data.title,
              description: data.body,
            },
          };
        } catch (error) {
          console.log(error);
          return {
            code: "api-fail",
            message: "getPostById - something went wrong",
            payload: null,
          };
        }
      },
      getCommentsByPostId: async (_, props) => {
        /* config */
        const { id } = props;
        const { API_ROOT_URL } = process.env;
        const URL = `${API_ROOT_URL}/posts/${id}/comments`;

        /* fetch data */
        try {
          const response = await axios.get(URL);
          const { data } = response;

          /* compose */
          const composedData = data.reduce((composed, obj) => {
            const comment = {
              id: obj.id,
              postId: obj.postId,
              title: obj.name,
              description: obj.body,
              userEmail: obj.email,
            };
            composed.push(comment);
            return composed;
          }, []);

          /* end */
          return {
            code: "api-ok",
            message: "getCommentsByPostId: No errors but check payload for response",
            schemaType: "CommentResponse",
            payload: composedData,
          };
        } catch (error) {
          console.log(error);
          return {
            code: "api-fail",
            message: "getPostById - something went wrong",
            payload: null,
          };
        }
      },
    },
    Mutation: {
      createNewPost: async (_, props) => {
        /* config */
        const { payload } = props;
        const { API_ROOT_URL } = process.env;
        const URL = `${API_ROOT_URL}/posts`;

        /* fetch data */
        try {
          const response = await axios.post(URL, { payload });
          const { id } = response.data;

          /* end */
          return {
            code: "api-ok",
            message: "createNewPost: New post created successfully",
            schemaType: "NewPostResponse",
            payload: { insertId: id },
          };
        } catch (error) {
          console.log(error);
          return {
            code: "api-fail",
            message: "createNewPost - could not create, something went wrong",
            payload: {},
          };
        }
      },
      updatePostById: async (_, props) => {
        /* config */
        const { payload } = props;
        const { id, update } = payload;
        const { API_ROOT_URL } = process.env;
        const URL = `${API_ROOT_URL}/posts/${id}`;

        /* fetch data */
        try {
          const response = await axios.put(URL, { update });
          const { id } = response.data;

          /* end */
          return {
            code: "api-ok",
            message: "updatePostById: post has been updated",
            schemaType: "UpdatePostResponse",
            payload: { updateId: id },
          };
        } catch (error) {
          console.log(error);
          return {
            code: "api-fail",
            message: "updatePostById: update failed, something went wrong",
            payload: {},
          };
        }
      },
      deletePostById: async (_, props) => {
        /* config */
        const { payload } = props;
        const { API_ROOT_URL } = process.env;
        const URL = `${API_ROOT_URL}/posts/${payload}`;

        /* fetch data */
        try {
          await axios.delete(URL);
          return {
            code: "api-ok",
            message: "deletePostById - Post successfully deleted",
            schemaType: "DeletePostResponse",
            payload: {
              postId: payload,
            },
          };
        } catch (error) {
          console.log(error);
          return {
            code: "api-fail",
            message: "deletePostById - could not delete post, something went wrong",
            payload: {},
          };
        }
      },
    },
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
