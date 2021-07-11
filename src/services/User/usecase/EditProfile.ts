import { UserDto } from "@HIHM/src/DTOs/UserDTO";
import User from "@Entities/user.entity";
import { ResultPayload } from "@HIHM/src/lib/utilities/result";
import { IRepository } from "@Repositories/UserRepository";

export class EditProfile {
  constructor(
    private readonly repo: IRepository,
    private readonly bcrypt: any,
    private readonly config: any
  ) {}
  async update(
    userId: string,
    user: UserDto
  ): Promise<ResultPayload<UserDto> | ResultPayload<Error> | undefined> {
    try {
      let encrptedPass = "";
      let userToUpdate: UserDto;
      let updates: User;
      if (user.password) {
        //encrpte the password
        encrptedPass = await this.bcrypt.hash(user.password, 10);
        userToUpdate = { ...user, password: encrptedPass };
        updates = await this.repo.update(
          { field: "_id", value: userId },
          userToUpdate
        );
      } else {
        updates = await this.repo.update({ field: "_id", value: userId }, user);
      }
      const result = new UserDto(
        updates.name,
        updates.email,
        updates.profilePic,
        updates.BackGroundImg,
        updates.Type
      );
      return new ResultPayload<UserDto>(result, 200);
    } catch (error: any) {
      const msg =
        this.config().env !== "production"
          ? error.message
          : "Unable to update Profile";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
