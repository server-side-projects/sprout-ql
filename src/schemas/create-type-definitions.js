/* node modules */
import fs from "fs";
import path from "path";

/* module */
function generateTypeDefinitions() {
  const schemaDir = path.resolve("src/schemas");
  const files = getGraphqlFiles(schemaDir);
  const typeDefs = files.map((filePath) => fs.readFileSync(filePath, "utf-8")).join("\n");
  return typeDefs;
}

/* recursive strategy */
function getGraphqlFiles(dir) {
  let results = [];

  fs.readdirSync(dir, { withFileTypes: true }).forEach((file) => {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      results = results.concat(getGraphqlFiles(filePath)); // recurse into subfolder
    } else if (file.isFile() && file.name.endsWith(".graphql")) {
      results.push(filePath);
    }
  });

  return results;
}

/* exports */
export default generateTypeDefinitions;
