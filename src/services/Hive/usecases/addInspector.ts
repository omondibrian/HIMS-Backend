import { ResultPayload } from "@HIHM/src/lib/utilities/result";
import { IUserRepository } from "@Repositories/UserRepository";

interface InspectorType {
  userId: string;
  apiaryId: string;
}
export class AddInspector {
  constructor(
    private readonly repo: IUserRepository,
    private readonly config: any
  ) {}

  async add(
    inspector: InspectorType
  ): Promise<
    ResultPayload<{ message: string }> | ResultPayload<Error> | undefined
  > {
    try {
      const result = await this.repo.insertInspector(
        inspector.userId,
        inspector.apiaryId
      );
      if (result) {
        return new ResultPayload<{ message: string }>(
          {
            message: "Successfully added user to an inspection site",
          },
          200
        );
      }else{
        return new ResultPayload<{ message: string }>(
            {
              message: "Error while adding user to an inspection site",
            },
            200
          );
      }
    } catch (error: any) {
      /* istanbul ignore else */
      const msg =
        this.config().env !== "production"
          ? error.message
          : "error while adding an inspector";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
