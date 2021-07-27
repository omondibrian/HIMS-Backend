import { HiveDTO } from "@HIHM/src/DTOs/HiveDTO";
import { ResultPayload } from "@HIHM/src/lib/utilities/result";
import { IHiveRepository } from "@Repositories/HiveRepository";

export interface IHiveAnalytics extends HiveDTO {
  labelDescription: string;
  Data: string[];
}

export class HiveAnalytics {
  constructor(private readonly repo: IHiveRepository) {}
  public async fetchAnalytics(
    hiveID: string
  ): Promise<ResultPayload<IHiveAnalytics> | ResultPayload<Error> | undefined> {
    let hiveProduction: string[];
    let result: ResultPayload<IHiveAnalytics>;
    try {
      const hiveDetails = await this.repo.GetHiveDetails(hiveID);
      const labelDescription = "Hive Yearly Honey Production ";
      const reports = hiveDetails.HiveReport;
      if (reports) {
        hiveProduction = reports.map((report) => report.Produce + "");
        result = new ResultPayload<IHiveAnalytics>(
          { ...hiveDetails, labelDescription, Data: hiveProduction },
          200
        );
        return result;
      } else {
        result = new ResultPayload<IHiveAnalytics>(
            { ...hiveDetails, labelDescription, Data: [] },
            200
          );
        return result;
        }

    } catch (err: any) {
      const msg =
        process.env.Node_ENV !== "production"
          ? err.message
          : "error while retriving stats";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
