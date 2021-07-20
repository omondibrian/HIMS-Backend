/* istanbul ignore file */
import con from "@HIHM/knexfile";
import Knex from "knex";
import Objection, { Model } from "objection";
import TableNames from "../constants";
import Apiary from "./Apiary.entity";
import User from "./user.entity";

const env = (process.env.NODE_ENV as string) || "development";
const config = env === "development" ? con.development : con.production;
const database = Knex(config);
Model.knex(database);

export default class InspectionSite extends Model {
  public User_id?: number;
  public Apiary_id!: string;

  static get tableName(): string {
    return TableNames.Ispection_Sites;
  }

  static get idColumn() {
    return [`${TableNames.user}_id`, `${TableNames.Apiary}_id`];
  }

  public static relationMappings: Objection.RelationMappings = {
    [TableNames.user]: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: `${TableNames.Ispection_Sites}.${TableNames.user}_id`,
        to: `${TableNames.user}_id`,
      },
    },
    [TableNames.Apiary]: {
      relation: Model.BelongsToOneRelation,
      modelClass: Apiary,
      join: {
        from: `${TableNames.Ispection_Sites}.${TableNames.Apiary}_id`,
        to: `${TableNames.Apiary}_id`,
      },
    },
  };
}
