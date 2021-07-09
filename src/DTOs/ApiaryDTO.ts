export class ApiaryDto {
  public name: string;
  public User_id: string;

  public _id?: string;
  constructor(name: string, User_id: string, id?: string) {
    this.name = name;
    this._id = id;
    this.User_id = User_id;
  }
}
