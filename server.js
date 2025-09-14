/* node modules */
import express from "express";
import dotenv from "dotenv";

/* app imports */
import appRoutes from "./src/index.js";

function runExpressApp() {
  const app = express();
  const { APP_PORT } = dotenv.config().parsed;
  app.listen(Number(APP_PORT), () => {
    console.log(`Sproute_QL App Running Port: ${APP_PORT}`);
    appRoutes(app);
  });
}
runExpressApp();
