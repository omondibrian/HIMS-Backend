# Hive Inspection And Monitoring System (HIMS)
![Node.js CI](https://github.com/omondibrian/HIMS-Backend/workflows/Node.js%20CI/badge.svg)
![My Imge](./bee.svg)

>## About The Project
>This is an API for Recording And managing Bee Hive Operations

>## Built With
>The project is built using the Nodejs platform and :-
>* [express](https://www.express.com/)
>* [Postgress Database](https://www.postgresql.org/)
>* [Jest](https://jestjs.io/docs/en/getting-started) for running the test suites

>## Prequisites
>- docker installed in your system
>- docker-compose
>- node and npm installed

## Installation Guide
```sh
npm install
```
 Enter your environment variable  in `.env`
   ```
   POSTGRES_PASSWORD=<password>
   POSTGRES_USER=<user>
   POSTGRES_DB=<database>
   POSTGRES_PORT=<port>
   JWT_SECRET=<secreate>
   ```
## Run Migrations
```sh
npm run migrations
```
## Running Tests
```sh
npm run test
```
