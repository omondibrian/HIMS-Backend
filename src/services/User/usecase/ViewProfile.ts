import User from "@Entities/user.entity";
import { UserDto } from "@HIHM/src/DTOs/UserDTO";
import { ResultPayload } from "@HIHM/src/lib/utilities/result";
import { IUserRepository } from "@Repositories/UserRepository";

export class ViewProfile {
  constructor(
    private readonly repo: IUserRepository,
    private readonly config: any
  ) {}

  public async profile(
    userId: string
  ): Promise<ResultPayload<UserDto> | ResultPayload<Error> | undefined> {
    try {
      const profile = (await this.repo.findById(userId)) as User;
      const user = new UserDto(
        profile.name,
        profile.email,
        profile.profilePic,
        profile.BackGroundImg,
        profile.Type
      );

      const result = new ResultPayload<UserDto>(user, 200);
      return result;
    } catch (error: any) {
      const msg =
        this.config().env !== "production"
          ? error.message
          : "Unable to fetch Profile";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
