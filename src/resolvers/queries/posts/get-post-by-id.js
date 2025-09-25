/* node modules */
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

/* module */
async function getPostById(_, props) {
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
}

/* exports */
export default getPostById;
