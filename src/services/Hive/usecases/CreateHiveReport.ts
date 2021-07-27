import { IHiveReport } from "@HIHM/src/DTOs/HiveDTO";
import { ResultPayload } from "@HIHM/src/lib/utilities/result";
import { IHiveRepository } from "@HIHM/src/Repositories/HiveRepository";

export class CreateHiveReport {
  constructor(
    private readonly repo: IHiveRepository,
    private readonly config: { env: string } | any
  ) {}
  public async Generate(
    hiveId: string,
    report: IHiveReport
  ): Promise<ResultPayload<IHiveReport> | ResultPayload<Error> | undefined> {
    try {
      const generatedReport = await this.repo.insertHiveReport(hiveId, report);
      const result: IHiveReport = {
        Pests: generatedReport.Pests,
        sawQueen: generatedReport.sawQueen,
        occupied: generatedReport.occupied,
        presenceOfQueenCells: generatedReport.presenceOfQueenCells,
        exccessiveDroneCells: generatedReport.exccessiveDroneCells,
        harvested: generatedReport.harvested,
        broodType: generatedReport.broodType,
        beePopulation: generatedReport.beePopulation,
        hiveTemperament: generatedReport.hiveTemperament,
        honeyStores: generatedReport.honeyStores,
        InspectionDate: generatedReport.InspectionDate,
        Produce: generatedReport.Produce,
        generalApiaryObservations: generatedReport.generalApiaryObservations,
      };
      return new ResultPayload<IHiveReport>(result, 200);
    } catch (error: any) {
      /* istanbul ignore else */
      const msg =
        this.config().env !== "production"
          ? error.message
          : "error while creating Report";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
