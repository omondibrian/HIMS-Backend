import { ApiaryDto } from "@HIHM/src/DTOs/ApiaryDTO";
import { ResultPayload } from "@HIHM/src/lib/utilities/result";
import { IHiveRepository } from "@HIHM/src/Repositories/HiveRepository";

export class ModifyApiary {
  constructor(private readonly repo: IHiveRepository, private readonly config: any) {}
  public async modify(
    id: string,
    data: ApiaryDto
  ): Promise<ResultPayload<ApiaryDto> | ResultPayload<Error> | undefined> {
    try {
      const result = await this.repo.modifyApiary(id, data);
      const dto = new ApiaryDto(result.name, result.User_id, result._id + "");
      return new ResultPayload<ApiaryDto>(dto, 200);
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
