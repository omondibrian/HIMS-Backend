import { HiveDTO } from "@HIHM/src/DTOs/HiveDTO";
import { ResultPayload } from "@HIHM/src/lib/utilities/result";
import { IRepository } from "@Repositories/HiveRepository";

export class ModifyHive {
  constructor(private readonly repo: IRepository,private readonly config:any) {}
  async modify(
    id: string,
    data: HiveDTO
  ): Promise<ResultPayload<HiveDTO> | ResultPayload<Error> | undefined> {
    try {
      const hive = await this.repo.updateHive(id, data);
      const result = new HiveDTO(
        hive.Name,
        hive.Type,
        hive.Apiary_id,
        undefined,
        hive.Hive_id
      );
      return new ResultPayload<HiveDTO>(result, 200);
    } catch (error: any) {
      /* istanbul ignore els */
      const msg =
        this.config().env !== "production"
          ? error.message
          : "error while modifying data";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
