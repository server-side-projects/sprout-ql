/* app imports */
import createNewPost from "./posts/create-new-post.js";
import updatePostById from "./posts/update-post-by-id.js";
import deletePostById from "./posts/delete-post-by-id.js";

/* exports */
export const AppMutations = {
  createNewPost,
  updatePostById,
  deletePostById
};
