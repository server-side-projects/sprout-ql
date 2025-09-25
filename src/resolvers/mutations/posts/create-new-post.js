/* node modules */
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

/* module */
async function createNewPost(_, props) {
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
}

/* exports */
export default createNewPost;
