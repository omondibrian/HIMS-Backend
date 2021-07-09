import "reflect-metadata";
// tslint:disable-next-line:ordered-imports
import * as express from "express";
import { Container } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";
import IUserReadOnlyRepository from "./application/repositories/IUserReadOnlyRepository";
import AuthServiceLocator from "./configuration/usecases/AuthServiceLocator";
import { TYPES } from "./constants/types";
import UserRepository from "./Repositories/UserRepository";

const container = new Container();

// set up bindings
container.bind<AuthServiceLocator>(TYPES.AuthServiceLocator).to(AuthServiceLocator);
container.bind<IUserReadOnlyRepository>(TYPES.IUserReadOnlyRepository).to(UserRepository);

const server = new InversifyExpressServer(container);
server.setConfig((application: express.Application) => {
    application.use(express.urlencoded({extended: true}));
    application.use(express.json());
});

const app = server.build();

app.listen(5000, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${5000}`);
});
