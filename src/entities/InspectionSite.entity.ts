/* istanbul ignore file */
import Knex from "knex";
import Objection, { Model } from "objection";
import con from "@HIHM/knexfile";
import TableNames from "../constants";
import User from "./user.entity";
import Apiary from "./Apiary.entity";

const env = (process.env.NODE_ENV as string) || "development";
const config = env === "development" ? con.development : con.production;
const database = Knex(config);
Model.knex(database);

export default class InspectionSite extends Model {
  User_id?: number;
  Apiary_id!: string;

  static get tableName(): string {
    return TableNames.Ispection_Sites;
  }

  static get idColumn() {
    return [`${TableNames.user}_id`,`${TableNames.Apiary}_id`];
  }

  static relationMappings: Objection.RelationMappings = {
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
