/* istanbul ignore file */
import Knex from "knex";
import { Model } from "objection";
import con from "@HIHM/knexfile";
import TableNames from "../constants";
import Apiary from "./Apiary.entity";
import Hive from "./Hive.entity";
import { LargeNumberLike } from "crypto";

const env = (process.env.NODE_ENV as string) || "development";
const config = env === "development" ? con.development : con.production;
const database = Knex(config);
Model.knex(database);

export default class HiveReport extends Model {
  _id?: number;
  Hive_id!:number;
  Pests!: boolean;
  sawQueen!: boolean;
  occupied!: boolean;
  presenceOfQueenCells!: boolean;
  exccessiveDroneCells!: boolean;
  harvested!: boolean;
  broodType!: string;
  beePopulation!: string;
  hiveTemperament!: string;
  honeyStores!: string;
  InspectionDate!: string;
  generalApiaryObservations!: string;
  
  static get tableName(): string {
    return TableNames.Hive_Report;
  }

  static get idColumn(): string {
    return "_id";
  }

  static relationMappings = {
    [TableNames.Hive]: {
      relation: Model.BelongsToOneRelation,
      modelClass: Hive,
      join: {
        from: `${TableNames.Hive_Report}.${TableNames.Hive}_id`,
        to: `${TableNames.Hive}._id`,
      },
    },
  };
}
