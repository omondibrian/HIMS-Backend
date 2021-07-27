/* istanbul ignore file */
import con from "@HIHM/knexfile";
import Knex from "knex" ;
import { Model } from "objection";
import TableNames from "../constants";
import Apiary from "./Apiary.entity";

const env = process.env.NODE_ENV as string || "development";
const config = env === "development" ? con.development : con.production;
const database = Knex(config);
Model.knex(database);

export default class User extends Model {

  static get tableName(): string {
    return TableNames.user;
  }

  static get idColumn(): string {
    return "_id";
  }

  public static relationMappings = {
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
  public _id?: number;
  public name!: string;
  public email!: string;
  public profilePic!: string;
  public password!: string;
  public BackGroundImg!: string;
  public Type!: string;
}
