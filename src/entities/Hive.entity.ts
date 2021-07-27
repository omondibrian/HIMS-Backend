/* istanbul ignore file */
import con from "@HIHM/knexfile";
import Knex from "knex";
import { Model } from "objection";
import TableNames from "../constants";
import Apiary from "./Apiary.entity";

const env = (process.env.NODE_ENV as string) || "development";
const config = env === "development" ? con.development : con.production;
const database = Knex(config);
Model.knex(database);

export default class Hive extends Model {
  static get tableName(): string {
    return TableNames.Hive;
  }

  static get idColumn(): string {
    return "_id";
  }

  public static relationMappings = {
    [TableNames.Apiary]: {
      relation: Model.BelongsToOneRelation,
      modelClass: Apiary,
      join: {
        from: `${TableNames.Hive}.${TableNames.Apiary}_id`,
        to: `${TableNames.Hive}._id`,
      },
    },
  };
  public _id?: number;
  public Name!: string;
  public Type!: string;
  public Apiary_id!: string;
}
