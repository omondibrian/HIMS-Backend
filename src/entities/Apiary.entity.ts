/* istanbul ignore file */
import Knex from "knex" ;
import Objection, { Model } from "objection";
import con from '@HIHM/knexfile'
import TableNames from "../constants";
import User from "./user.entity";

const env = process.env.NODE_ENV as string || "development"  
const config = env === "development" ? con.development: con.production;
const database = Knex(config);
Model.knex(database);

export default class Apiary extends Model {
  _id?: number;
  name!: string;
  User_id!:string;
  
  static get tableName(): string {
    return TableNames.Apiary;
  }

  static get idColumn() :string{
    return '_id';
  } 
  
  static relationMappings:Objection.RelationMappings = {
    [TableNames.user]: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: `${TableNames.Apiary}.${TableNames.user}_id`,
        to: `${TableNames.user}._id`,
      },
    },
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