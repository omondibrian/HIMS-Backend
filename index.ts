import "reflect-metadata";
import cors from "cors";
// tslint:disable-next-line:ordered-imports
import * as express from "express";
import fileUpload from "express-fileupload";
import helmet from "helmet";
import { Container } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";
import morgan from "morgan";

import { TYPES } from "@HIHM/src/constants/Types";
import UserRepository, { IUserRepository } from "@Repositories/UserRepository";
import NotificationService, { IMailer } from "@Services/email";
import { UserServiceProvider } from "@Services/User";

import AuthServiceUtilities, {
  IAuthserviceUtilities,
} from "@HIHM/src/lib/utilities/validation/auth_service_utilities";

const container = new Container();

// set up bindings
container
  .bind<UserServiceProvider>(TYPES.UserServiceProvider)
  .to(UserServiceProvider);
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
container
  .bind<IAuthserviceUtilities>(TYPES.IAuthserviceUtilities)
  .to(AuthServiceUtilities);
container.bind<IMailer>(TYPES.IMailer).to(NotificationService);

const server = new InversifyExpressServer(container);
server.setConfig((application: express.Application) => {
  application.use(express.urlencoded({ extended: true }));
  application.use(express.json());
  application.use(fileUpload());
  application.use(cors());
  application.use(helmet());
  application.use(morgan("tiny"));
});

const app = server.build();

app.listen(5000, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${5000}`);
});
