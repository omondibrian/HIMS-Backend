import { UserDto } from "@HIHM/src/DTOs/UserDTO";
import userEntity from "@HIHM/src/entities/user.entity";
import { IRepository } from "@Repositories/UserRepository";

export class UserMockRepository implements IRepository {
    insert(data: UserDto): Promise<userEntity> {
        throw new Error("Method not implemented.");
    }
    update(options: { field: string; value: string; }, data: UserDto): Promise<userEntity> {
        throw new Error("Method not implemented.");
    }
    find(data: { field: string; value: string; }): Promise<userEntity | undefined> {
        throw new Error("Method not implemented.");
    }
    findById(id: string): Promise<userEntity | undefined> {
        throw new Error("Method not implemented.");
    }
    Delete(id: string): Promise<userEntity> {
        throw new Error("Method not implemented.");
    }
    insertInspector(userId: string, apiaryId: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    fetchInspector(name: String): Promise<userEntity | undefined> {
        throw new Error("Method not implemented.");
    }
    removeAnInspector(id: string): Promise<userEntity> {
        throw new Error("Method not implemented.");
    }
  
}