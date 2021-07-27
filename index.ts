import "reflect-metadata";
import 'module-alias/register'
import express from 'express'
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import fileUpload from "express-fileupload";
import swaggerDocs from "swagger-jsdoc";
import SwaggerUIExpress from "swagger-ui-express";

import userRoutes from "@Routes/Auth";
import hiveRoutes from "./src/routes/Hive";
import { TokenMiddleware, UserMode } from "./src/lib/middleware";

const App = express()

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "HIMS API",
      version: "1.0.0",
    },
  },
  apis: [
    "./src/routes/Auth/index.ts",
    "./src/routes/Hive/index.ts"
  ], // files containing swagger annotations as above
};
const openApiDocs = swaggerDocs(swaggerOptions);
console.log(openApiDocs);

App.use("/docs", SwaggerUIExpress.serve, SwaggerUIExpress.setup(openApiDocs));
App.use(express.urlencoded({ extended: true }));
App.use(express.json());
App.use(fileUpload());
App.use(cors());
App.use(helmet());
App.use(morgan("tiny"));
App.use('/api/v1/auth/',userRoutes)
App.use('/api/v1/Hive/',TokenMiddleware,UserMode,hiveRoutes)


App.listen(5000, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${5000}`);
});
