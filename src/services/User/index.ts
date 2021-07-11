import { TYPES } from "@HIHM/src/constants/Types";
import { IAuthserviceUtilities } from "@HIHM/src/lib/utilities/validation/auth_service_utilities";
import { IUserRepository } from "@HIHM/src/Repositories/UserRepository";
import { inject, injectable } from "inversify";
import { IMailer } from "../email";
import { EditProfile } from "./usecase/EditProfile";
import { LogIn } from "./usecase/LogIn";
import { PasswordReset } from "./usecase/PasswordReset";
import { Registration } from "./usecase/Register";
import { ViewProfile } from "./usecase/ViewProfile";

@injectable()
export class UserServiceProvider {
  private readonly repo: IUserRepository;
  private readonly mailer: IMailer;
  private readonly utilities: IAuthserviceUtilities;
  constructor(
    @inject(TYPES.IUserRepository) repo: IUserRepository,
    @inject(TYPES.IMailer) mailer: IMailer,
    @inject(TYPES.IAuthserviceUtilities) utilities: IAuthserviceUtilities,
    private readonly jwt: any,
    private readonly bcrypt: any,
    private readonly generate: any,
    private readonly config: any
  ) {
    this.repo = repo;
    this.mailer = mailer;
    this.utilities = utilities;
  }
  /**
   * @description registration service
   */
  public get registration() {
    return new Registration(
      this.repo,
      this.utilities,
      this.jwt,
      this.bcrypt,
      this.mailer,
      this.config
    );
  }
  /**
   * @description login service
   */
  public get login() {
    return new LogIn(
      this.repo,
      this.utilities,
      this.jwt,
      this.bcrypt,
      this.config
    );
  }
  /**
   * @description password reset service
   */
  public get resetPass() {
    return new PasswordReset(
      this.repo,
      this.mailer,
      this.generate,
      this.bcrypt,
      this.config
    );
  }
  /**
   * @description fetchprofile service
   */
  public get fetchProfile() {
    return new ViewProfile(this.repo, this.config);
  }
  /**
   * @description edit profile service
   */
  public get editProfile() {
    return new EditProfile(this.repo, this.bcrypt, this.config);
  }
}
