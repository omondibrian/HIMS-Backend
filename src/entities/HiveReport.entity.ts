/* istanbul ignore file */
import con from "@HIHM/knexfile";
import Knex from "knex";
import { Model } from "objection";
import TableNames from "../constants";
import Hive from "./Hive.entity";

const env = (process.env.NODE_ENV as string) || "development";
const config = env === "development" ? con.development : con.production;
const database = Knex(config);
Model.knex(database);

export default class HiveReport extends Model {
  public _id?: number;
  public Hive_id!: number;
  public Pests!: boolean;
  public sawQueen!: boolean;
  public occupied!: boolean;
  public presenceOfQueenCells!: boolean;
  public exccessiveDroneCells!: boolean;
  public harvested!: boolean;
  public broodType!: string;
  public beePopulation!: string;
  public hiveTemperament!: string;
  public honeyStores!: string;
  public InspectionDate!: string;
  public Produce!: number;
  public generalApiaryObservations!: string;

  static get tableName(): string {
    return TableNames.Hive_Report;
  }

  static get idColumn(): string {
    return "_id";
  }

  public static relationMappings = {
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
