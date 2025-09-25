/* node modules */
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

/* module */
async function deletePostById(_, props) {
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
}

/* exports */
export default deletePostById;
