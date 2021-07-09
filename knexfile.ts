// Update with your config settings.
  import {config  } from "dotenv";
  config();
  export default  {
  
    development: {
      client: 'pg',
      connection: {
        port:process.env.POSTGRES_PORT as unknown as  number,
        database: process.env.POSTGRES_DB,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
      },
      migrations: {
        directory: './db/migrations',
      },
      seeds: {
        directory: './db/seed',
      },
    },
  
    staging: {
      client: 'pg',
      connection: {
        port:process.env.POSTGRES_PORT  as unknown as  number,
        database: process.env.POSTGRES_DB,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
      },
      migrations: {
        directory: './db/migrations',
      },
      seeds: {
        directory: './db/seed',
      },
    },
  
    production: {
      client: 'pg',
      connection: {
        port:process.env.POSTGRES_PORT  as unknown as  number,
        database: process.env.POSTGRES_DB,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
      },
      migrations: {
        directory: './db/migrations',
      },
      seeds: {
        directory: './db/seed',
      },
    },
  
  };


