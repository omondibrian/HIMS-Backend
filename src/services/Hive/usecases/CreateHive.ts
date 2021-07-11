import { HiveDTO } from "@HIHM/src/DTOs/HiveDTO";
import { ResultPayload } from "@HIHM/src/lib/utilities/result";
import { IHiveRepository } from "@Repositories/HiveRepository";

export class CreateHive {
  constructor(private readonly repo: IHiveRepository, private readonly config: any) {}
  public async add(
    hive: HiveDTO
  ): Promise<ResultPayload<HiveDTO> | ResultPayload<Error> | undefined> {
    try {
      const newHive = await this.repo.createHive(hive);
      const result = new HiveDTO(
        newHive.Name,
        newHive.Type,
        newHive.Apiary_id,
        undefined,
        newHive.Hive_id
      );
      console.log(result);
      return new ResultPayload<HiveDTO>(result, 200);
    } catch (error: any) {
      /* istanbul ignore else */
      const msg =
        this.config().env !== "production"
          ? error.message
          : "error while creating Hive";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
