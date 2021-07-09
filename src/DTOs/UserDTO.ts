export class UserDto {
  public name: string;
  public email: string;
  public profilePic: string;
  public BackGroundImg: string;
  public Type: string;
  public password?:string
  constructor(
    name: string,
    email: string,
    profilePic: string,
    BackGroundImg: string,
    Type: string,
    Password?:string
  ) {
    this.name = name;
    this.email = email;
    this.Type = Type;
    this.profilePic = profilePic;
    this.BackGroundImg = BackGroundImg;
    this.password =  Password;
  }
}
