import { injectable } from "inversify";
import { UserDto } from "../DTOs/UserDTO";
import User from "@Entities/user.entity";
import InspectionSite from "../entities/InspectionSite.entity";
export interface IRepository {
  insert(data: UserDto): Promise<User>;
  update(
    options: { field: string; value: string },
    data: UserDto
  ): Promise<User>;
  find(data: { field: string; value: string }): Promise<User|undefined>;
  findById(id: string): Promise<User|undefined>;
  Delete(id: string): Promise<User>;
  insertInspector(userId: string, apiaryId: string): Promise<boolean>;
  fetchInspector(name: String): Promise<User|undefined>;
  removeAnInspector(id: string): Promise<User>;
  
}
@injectable()
export default class UserRepository implements IRepository {
  async insert(data: UserDto): Promise<User> {
    const result = await User.query().insert(data);
    return result;
  }
  async update(
    options: { field: string; value: string },
    data: UserDto
  ): Promise<User> {
    await User.query().patch(data).where(options.field, "=", options.value);
    const result = await User.query()
      .select("*")
      .where(options.field, "=", options.value);
    return result[0];
  }
  async find(data: { field: string; value: string }): Promise<User|undefined> {
    const result = await User.query()
      .select("*")
      .where(data.field, "=", data.value);
    return result[0];
  }
  async findById(id: string): Promise<User |undefined> {
    const user = await User.query().findById(id);
    return user;
  }
  async Delete(id: string): Promise<User> {
    const deletedUser = await this.findById(id) as User;
    await User.query().deleteById(id);
    return deletedUser;
  }
  async insertInspector(userId: string, apiaryId: string): Promise<boolean> {
    const result = await InspectionSite.query()
      .insert({
        User_id: userId,
        Apiary_id: apiaryId,
      })
      .isInsert();
    return result;
  }
  async fetchInspector(name: String): Promise<User|undefined> {
    const inspector = await User.query().select("*").where("name", "=", name);

    return inspector[0];
  }
  //TODO:Change to a transcation
  async removeAnInspector(id: string): Promise<User> {
    const inspector = await User.query().findById(id);
    await InspectionSite.query().delete().where("User_id", "=", id);
    return inspector;
  }
}
