/* node modules */
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

/* module */
async function getUserById(_, props) {
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
}

/* exports */
export default getUserById;
