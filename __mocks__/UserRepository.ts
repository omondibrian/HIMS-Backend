import { UserDto } from "@HIHM/src/DTOs/UserDTO";
import userEntity from "@HIHM/src/entities/user.entity";
import { IUserRepository } from "@Repositories/UserRepository";

export class UserMockRepository implements IUserRepository {
    public insert(data: UserDto): Promise<userEntity> {
        throw new Error("Method not implemented.");
    }
    public update(options: { field: string; value: string; }, data: UserDto): Promise<userEntity> {
        throw new Error("Method not implemented.");
    }
    public find(data: { field: string; value: string; }): Promise<userEntity | undefined> {
        throw new Error("Method not implemented.");
    }
    public findById(id: string): Promise<userEntity | undefined> {
        throw new Error("Method not implemented.");
    }
    public Delete(id: string): Promise<userEntity> {
        throw new Error("Method not implemented.");
    }
    public insertInspector(userId: string, apiaryId: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    public fetchInspector(name: String): Promise<userEntity | undefined> {
        throw new Error("Method not implemented.");
    }
    public removeAnInspector(id: string): Promise<userEntity> {
        throw new Error("Method not implemented.");
    }

}
