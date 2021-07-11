import { HiveDTO } from "@HIHM/src/DTOs/HiveDTO";
import { ResultPayload } from "@HIHM/src/lib/utilities/result";
import { IHiveRepository } from "@Repositories/HiveRepository";

export class FetchHiveReport {
  constructor(
    private readonly repo: IHiveRepository,
    private readonly config: { env: string } | any
  ) {}

  public async get(
    hiveId: string
  ): Promise<ResultPayload<HiveDTO> | ResultPayload<Error> | undefined> {
    try {
      const hiveDetails = await this.repo.GetHiveDetails(hiveId);
      const result = new ResultPayload<HiveDTO>(hiveDetails, 200);
      return result;
    } catch (error: any) {
      /* istanbul ignore else */
      const msg =
        this.config().env !== "production"
          ? error.message
          : "error while fetching hive details";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
