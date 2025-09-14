/* node modules */
import axios from "axios";
import dotenv from "dotenv";
import { ruruHTML } from "ruru/server";
import { createHandler } from "graphql-http/lib/use/express";
import { buildSchema } from "graphql";

/* app imports */
dotenv.config();

/* module */
function appRoutes(app) {
  const schema = buildSchema(`
    type User {
      id: Int,
      name: String!
      email: String!
      phone: String!
      city: String!
    }
    type UserResponse {
      code: String!,
      message: String,
      payload: User
    }

    type Post {
      userId: Int!,
      postId: Int!,
      title: String!,
      description: String!
    }
    type PostResponse {
      code: String!,
      message: String,
      payload: Post
    }

    type Comment {
      id: Int!,
      postId: Int!,
      title: String!,
      description: String!,
      userEmail: String!
    }
    type CommentResponse {
      code: String!,
      message: String,
      payload: [Comment]
    }

    type DeletedPost {
      postId: Int
    }
    type DeletePostResponse {
      code: String!
      message: String
      payload: DeletedPost
    }

    input NewPost {
      userId: Int!
      title: String!
      body: String!
    }
    type NewPostInsertId {
      insertId: Int!
    }
    type NewPostResponse {
      code: String!
      message: String
      payload: NewPostInsertId
    }

    input UpdatePost {
      id: Int!
      userId: Int!
      title: String!
      body: String!
    }
    type UpdatePostInsertId {
      updateId: Int!
    }
    type UpdatePostResponse {
      code: String!
      message: String
      payload: UpdatePostInsertId
    }

    type Query {
      getUserById(id: Int): UserResponse
      getPostById(id: Int): PostResponse
      getCommentsByPostId(id: Int): CommentResponse
    }
    type Mutation {
      deletePostById(id: Int): DeletePostResponse
      createNewPost(newPost: NewPost): NewPostResponse
      updatePostById(id: Int, update: UpdatePost): UpdatePostResponse
    }
  `);

  const resolvers = {
    getUserById: async (props) => {
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
    getPostById: async (props) => {
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
    getCommentsByPostId: async (props) => {
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
    createNewPost: async (props) => {
      /* config */
      const { newPost } = props;
      const { API_ROOT_URL } = process.env;
      const URL = `${API_ROOT_URL}/posts`;

      /* fetch data */
      try {
        const response = await axios.post(URL, { newPost });
        const { id } = response.data;

        /* end */
        return {
          code: "api-ok",
          message: "createNewPost: New post created successfully",
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
    updatePostById: async (props) => {
      /* config */
      const { id, update } = props;
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
    deletePostById: async (props) => {
      /* config */
      const { id } = props;
      const { API_ROOT_URL } = process.env;
      const URL = `${API_ROOT_URL}/posts/${id}`;

      /* fetch data */
      try {
        await axios.delete(URL);
        return {
          code: "api-ok",
          message: "deletePostById - Post successfully deleted",
          payload: {
            postId: id,
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
  };

  app.all(
    "/graphql",
    createHandler({
      schema,
      rootValue: resolvers,
    })
  );

  app.get("/", (req, res) => {
    res.type("html");
    res.end(ruruHTML({ endpoint: "/graphql" }));
  });
}

/* exports */
export default appRoutes;
