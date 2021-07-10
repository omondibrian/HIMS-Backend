import { ApiaryDto } from "@HIHM/src/DTOs/ApiaryDTO";
import { ResultPayload } from "@HIHM/src/lib/utilities/result";
import { IRepository } from "@Repositories/HiveRepository";

export class CreateApiary {
  constructor(private readonly repo: IRepository,private readonly config:any) {}
  async add(
    apiary: ApiaryDto
  ): Promise<ResultPayload<ApiaryDto> | ResultPayload<Error> | undefined> {
    try {
      let result = await this.repo.createApiary(apiary);
      const payload = new ApiaryDto(
        result.name,
        result.User_id,
        result._id + ""
      );
      return new ResultPayload<ApiaryDto>(payload, 200);
    } catch (error: any) {
      /* istanbul ignore else */ 
      const msg =
        this.config().env !== "production"
          ? error.message
          : "error while creating Apiary";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
