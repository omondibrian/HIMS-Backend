/* istanbul ignore file */
import Knex from "knex" ;
import { Model } from "objection";
import con from '@HIHM/knexfile'
import TableNames from "../constants";
import Apiary from "./Apiary.entity";

const env = process.env.NODE_ENV as string || "development"  
const config = env === "development" ? con.development: con.production;
const database = Knex(config);
Model.knex(database);

export default class User extends Model {
  _id?: number;
  name!: string;
  email!: string;
  profilePic!: string;
  password!: string;
  BackGroundImg!: string;
  Type!: string;

  static get tableName(): string {
    return TableNames.user;
  }

  static get idColumn() :string{
    return '_id';
  } 
  

    
  static relationMappings = {
    [TableNames.Apiary]: {
      relation: Model.HasOneThroughRelation,
      modelClass: Apiary,
      join: {
        from: `${TableNames.user}_id`,
        through: {
          // inspectionSites is the join table.
          from: `${TableNames.Ispection_Sites}.${TableNames.user}_id`,
          to: `${TableNames.Ispection_Sites}.${TableNames.Apiary}_id`
        },
        to: `${TableNames.Apiary}_id`,
      }
    }
  };
}