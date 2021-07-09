/**
 * @fileOverview contains the various functions to manage the users route.
 * @author Brian Omondi
 * @version 1.0.0
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ApiaryDto } from "@HIHM/src/DTOs/ApiaryDTO";
import { HiveDTO, IHiveReport } from "@HIHM/src/DTOs/HiveDTO";
import Apiary from "@Entities/Apiary.entity";
import Hive from "@Entities/Hive.entity";
import HiveReport from "@Entities/HiveReport.entity";
import TableNames from "../constants";
import { injectable } from "inversify";
import InspectionSite from "../entities/InspectionSite.entity";

export interface IRepository {
  createApiary(data: ApiaryDto): Promise<Apiary>;
  createHive(
    data: Omit<HiveDTO, "HiveReport">
  ): Promise<Omit<HiveDTO, "HiveReport">>;
  modifyApiary(id: string, data: Partial<ApiaryDto>): Promise<Apiary>;
  getApiary(ownerId: string): Promise<Array<Apiary>>;
  DeleteApiary(id: string): Promise<Apiary>;
  GetHives(ApiaryId: string): Promise<Array<Hive>>;
  GetHiveDetails(hiveId: string): Promise<HiveDTO>;
  RemoveHive(id: string): Promise<Hive>;
  insertHiveReport(hiveId: string, report: IHiveReport): Promise<HiveReport>;
  updateHive(
    hiveId: string,
    data: Omit<HiveDTO, "HiveReport">
  ): Promise<Omit<HiveDTO, "HiveReport">>;
  fetchInspectionSites(userId: string): Promise<Array<ApiaryDto>>;
}
@injectable()
export class HiveRepository implements IRepository {
  async fetchInspectionSites(userId: string): Promise<ApiaryDto[]> {
    const inspectionSitesData = await InspectionSite.query()
      .select(`${TableNames.Ispection_Sites}.${TableNames.Apiary}_id`)
      .where(
        `${TableNames.Ispection_Sites}.${TableNames.user}_id`,
        "=",
        userId
      );
    const ids = inspectionSitesData.map((data) => data.Apiary_id);
    const apiaryInfo = await Apiary.query().findByIds(ids);
    const result = apiaryInfo.map(
      (apiary) => new ApiaryDto(apiary.name, apiary.User_id, apiary._id + "")
    );
    console.log(result);
    return result;
  }

  async createApiary(data: ApiaryDto): Promise<Apiary> {
    const apiary = await Apiary.query().insert(data);
    return apiary;
  }
  async modifyApiary(id: string, data: Partial<ApiaryDto>): Promise<Apiary> {
    const updatedApiary = await Apiary.query().patchAndFetchById(id, data);
    return updatedApiary;
  }
  async getApiary(ownerId: string): Promise<Apiary[]> {
    const apiaries = await Apiary.query()
      .select("*")
      .where(`${TableNames.user}_id `, "=", ownerId);
    return apiaries;
  }
  async DeleteApiary(id: string): Promise<Apiary> {
    const apiary = await Apiary.query().findById(id);
    await Apiary.query().deleteById(id);
    return apiary;
  }
  async GetHives(ApiaryId: string): Promise<Hive[]> {
    const hives = await Hive.query()
      .select("*")
      .where(`${TableNames.Apiary}_id `, "=", ApiaryId);
    return hives;
  }
  async GetHiveDetails(hiveId: string): Promise<HiveDTO> {
    const HiveDetails = await Hive.query()
      .select(
        `${TableNames.Hive}._id`,
        `${TableNames.Hive}.Name`,
        `${TableNames.Hive}.Type`,
        `${TableNames.Hive}.Apiary_id`
      )
      .from(TableNames.Hive)
      .where("_id", "=", hiveId);

    const InspectionReports = await HiveReport.query()
      .select(
        `${TableNames.Hive_Report}.Pests`,
        `${TableNames.Hive_Report}.sawQueen`,
        `${TableNames.Hive_Report}.occupied`,
        `${TableNames.Hive_Report}.presenceOfQueenCells`,
        `${TableNames.Hive_Report}.exccessiveDroneCells`,
        `${TableNames.Hive_Report}.harvested`,
        `${TableNames.Hive_Report}.broodType`,
        `${TableNames.Hive_Report}.beePopulation`,
        `${TableNames.Hive_Report}.hiveTemperament`,
        `${TableNames.Hive_Report}.honeyStores`,
        `${TableNames.Hive_Report}.InspectionDate`,
        `${TableNames.Hive_Report}.Produce`,
        `${TableNames.Hive_Report}.generalApiaryObservations`
      )
      .from(TableNames.Hive_Report)
      .where(`${TableNames.Hive_Report}.${TableNames.Hive}_id`, "=", hiveId);
    const hiveReports = InspectionReports.map((report) => {
      return {
        Pests: report.Pests,
        sawQueen: report.sawQueen,
        occupied: report.occupied,
        presenceOfQueenCells: report.presenceOfQueenCells,
        exccessiveDroneCells: report.exccessiveDroneCells,
        harvested: report.harvested,
        broodType: report.broodType,
        beePopulation: report.beePopulation,
        hiveTemperament: report.hiveTemperament,
        honeyStores: report.honeyStores,
        InspectionDate: report.InspectionDate,
        Produce: report.Produce,
        generalApiaryObservations: report.generalApiaryObservations,
      } as IHiveReport;
    });
    const result = new HiveDTO(
      HiveDetails[0].Name,
      HiveDetails[0].Type,
      HiveDetails[0].Apiary_id,
      hiveReports,
      HiveDetails[0]._id + ""
    );
    return result;
  }
  async RemoveHive(id: string): Promise<Hive> {
    const hive = await Hive.query().findById(id);
    await Hive.query().deleteById(id);
    return hive;
  }
  async createHive(
    data: Omit<HiveDTO, "HiveReport">
  ): Promise<Omit<HiveDTO, "HiveReport">> {
    const hive = await Hive.query().insert(data);
    console.log(hive);
    const result = new HiveDTO(
      hive.Name,
      hive.Type,
      hive.Apiary_id,
      undefined,
      hive._id + ""
    );
    return result;
  }
  async insertHiveReport(
    hiveId: string,
    report: IHiveReport
  ): Promise<HiveReport> {
    const hiveReport = await HiveReport.query().insertAndFetch({
      ...report,
      Hive_id: hiveId,
    });
    return hiveReport;
  }
  async updateHive(
    hiveId: string,
    data: Omit<HiveDTO, "HiveReport">
  ): Promise<Omit<HiveDTO, "HiveReport">> {
    const hive = await Hive.query().patchAndFetchById(hiveId, data);
    const result = new HiveDTO(
      hive.Name,
      hive.Type,
      hive.Apiary_id,
      undefined,
      hive._id + ""
    );
    return result;
  }
}
