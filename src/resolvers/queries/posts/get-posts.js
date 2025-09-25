/* node modules */
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

/* cursor encoder */
function encodeCursor(id) {
  return Buffer.from(`post:${id}`).toString("base64");
}
/* cursor decoder */
function decodeCursor(cursor) {
  const str = Buffer.from(cursor, "base64").toString("ascii");
  const [, idStr] = str.split(":");
  return parseInt(idStr, 10);
}

/* module */
async function getPosts(_, props) {
  /* config */
  const { first, from } = props.payload;
  const { API_ROOT_URL } = process.env;
  const URL = `${API_ROOT_URL}/posts`;

  /* fetch data */
  try {
    const response = await axios.get(URL);
    const { data } = response;
    let startIndex = 0;

    /* check if from value is provided */
    if (from) {
      const decodedId = decodeCursor(from)
      startIndex = data.findIndex((obj) => obj.id === decodedId);
    }

    /* slice off as per props */
    const sliced = data.slice(startIndex, startIndex + first);

    /* compose the data structure */
    const composedData = [...sliced].reduce((composed, obj) => {
      const postEdge = {
        node: {
          userId: obj.userId,
          postId: obj.id,
          title: obj.title,
          description: obj.body
        },
        cursor: encodeCursor(obj.id)
      };
      composed.push(postEdge);
      return composed;
    }, []);

    /* end */
    return {
      code: "api-ok",
      message: "getPostById: No errors but check payload for response",
      schemaType: "PostPaginationResponse",
      payload: composedData
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
export default getPosts;
