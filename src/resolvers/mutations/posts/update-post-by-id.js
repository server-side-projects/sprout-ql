/* node modules */
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

/* module */
async function updatePostById(_, props) {
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
}

/* exports */
export default updatePostById;
