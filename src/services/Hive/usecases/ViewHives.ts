import { HiveDTO } from "@HIHM/src/DTOs/HiveDTO";
import { ResultPayload } from "@HIHM/src/lib/utilities/result";
import { IRepository } from "@Repositories/HiveRepository";

export class ViewHives {
  constructor(private readonly repo: IRepository,private readonly config:any) {}

  async fetch(
    apiaryID: string
  ): Promise<ResultPayload<Array<HiveDTO>> | ResultPayload<Error> | undefined> {
    try {
      const hives = await this.repo.GetHives(apiaryID);
      const result = hives.map(
        (hive) =>
          new HiveDTO(
            hive.Name,
            hive.Type,
            hive.Apiary_id,
            undefined,
            hive._id + ""
          )
      );
      return new ResultPayload<Array<HiveDTO>>(result, 200);
    } catch (error: any) {
      /* istanbul ignore else */
      const msg =
       this.config().env !== "production"
          ? error.message
          : "error while retriving data";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
