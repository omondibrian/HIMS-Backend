import { ApiaryDto } from "@HIHM/src/DTOs/ApiaryDTO";
import { ResultPayload } from "@HIHM/src/lib/utilities/result";
import { IRepository } from "@Repositories/HiveRepository";

export class ViewApiary {
  constructor(private readonly repo: IRepository) {}
  async fetch(
    ownerId: string,
    mode = false
  ): Promise<
    ResultPayload<Array<ApiaryDto>> | ResultPayload<Error> | undefined
  > {
    try {
      if (mode) {
        const apiaries = await this.repo.fetchInspectionSites(ownerId);
        return new ResultPayload<Array<ApiaryDto>>(apiaries, 200);
      } else {
        const apiaries = await this.repo.getApiary(ownerId);
        const result = apiaries.map((apiary) => {
          return new ApiaryDto(apiary.name, apiary.User_id, apiary._id + "");
        });
        return new ResultPayload<Array<ApiaryDto>>(result, 200);
      }
    } catch (error: any) {
      /* istanbul ignore else */
      const msg =
        process.env.Node_ENV !== "production"
          ? error.message
          : "error while retriving data";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
