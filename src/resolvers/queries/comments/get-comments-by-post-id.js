/* node modules */
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

/* module */
async function getCommentsByPostId(_, props) {
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
}

/* exports */
export default getCommentsByPostId;
