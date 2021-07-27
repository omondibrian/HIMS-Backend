import { ApiaryDto } from "@HIHM/src/DTOs/ApiaryDTO";
import { ResultPayload } from "@HIHM/src/lib/utilities/result";
import { IHiveRepository } from "@Repositories/HiveRepository";

export class DeleteApiary {
  constructor(
    private readonly repo: IHiveRepository,
    private readonly config: any
  ) {}
  public async delete(
    apiaryID: string
  ): Promise<ResultPayload<ApiaryDto> | ResultPayload<Error> | undefined> {
    try {
      const apiary = await this.repo.DeleteApiary(apiaryID);
      const result = new ApiaryDto(
        apiary.name,
        apiary.User_id,
        apiary._id + ""
      );

      return new ResultPayload<ApiaryDto>(result, 200);
    } catch (error: any) {
      /* istanbul ignore else */
      const msg =
        this.config().env !== "production"
          ? error.message
          : "error while deleting data";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
