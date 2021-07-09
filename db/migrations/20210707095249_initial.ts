
require('module-alias/register')

import TableNames, { orderedTables } from "@HIHM/src/constants";
import { addDefaultColumns, createRef } from "@HIHM/src/lib/db";
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await Promise.all([
    //Users table
    await knex.schema.createTable(
      TableNames.user,
      (table: Knex.CreateTableBuilder) => {
        table.increments("_id").notNullable().primary();
        table.string("name").notNullable();
        table.string("email").unique().notNullable();
        table.string("password").notNullable();
        table.string("profilePic").notNullable();
        table.string("BackGroundImg").notNullable();
        table.string("Type").notNullable();
        addDefaultColumns(table);
      }
    ),
    //Apiary table
    await knex.schema.createTable(
      TableNames.Apiary,
      (table: Knex.CreateTableBuilder) => {
        table.increments("_id").notNullable().primary();
        table.string("name").notNullable();
        createRef(table, TableNames.user);
        addDefaultColumns(table);
      }
    ),
    //Hive table
    await knex.schema.createTable(
      TableNames.Hive,
      (table: Knex.CreateTableBuilder) => {
        table.increments("_id").notNullable().primary();
        table.string("Name").notNullable();
        table.string("Type").notNullable();
        createRef(table, TableNames.Apiary);
        addDefaultColumns(table);
      }
    ),
    //Hive-Reports table
    await knex.schema.createTable(
      TableNames.Hive_Report,
      (table: Knex.CreateTableBuilder) => {
        table.increments("_id").notNullable().primary();
        table.boolean("Pests").notNullable();
        table.boolean("sawQueen").notNullable();
        table.boolean("occupied").notNullable();
        table.boolean("presenceOfQueenCells").notNullable();
        table.boolean("exccessiveDroneCells").notNullable();
        table.boolean("harvested").notNullable();
        table.string("broodType").notNullable();
        table.string("beePopulation").notNullable();
        table.string("hiveTemperament").notNullable();
        table.string("honeyStores").notNullable();
        table.string("InspectionDate").notNullable();
        table.integer("Produce").notNullable().defaultTo(0);
        table.string("generalApiaryObservations").notNullable();
        createRef(table, TableNames.Hive);
        addDefaultColumns(table);
      }
    ),
    //INSPECTION_SITES table
    await knex.schema.createTable(
      TableNames.Ispection_Sites,
      (table: Knex.CreateTableBuilder) => {
        createRef(table, TableNames.user);
        createRef(table, TableNames.Apiary);
        addDefaultColumns(table);
      }
    ),
  ]);
}

export async function down(knex: Knex): Promise<void> {
    await Promise.all(
        orderedTables.map(async (tableName: string) =>
          knex.schema.dropTableIfExists(tableName)
        )
      );
}
 