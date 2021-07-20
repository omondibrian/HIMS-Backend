import AuthServiceUtilities, {
  IAuthserviceUtilities,
} from "@HIHM/src/lib/utilities/validation/auth_service_utilities";
import UserRepository, {
  IUserRepository,
} from "@HIHM/src/Repositories/UserRepository";
import NotificationService, { IMailer } from "../email";
import { EditProfile } from "./usecase/EditProfile";
import { LogIn } from "./usecase/LogIn";
import { PasswordReset } from "./usecase/PasswordReset";
import { Registration } from "./usecase/Register";
import { ViewProfile } from "./usecase/ViewProfile";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { generate } from "randomstring";
import { config } from "../../configuration/index";

export class UserServiceProvider {
  private readonly utilities: IAuthserviceUtilities;
  private readonly repo: IUserRepository;
  private readonly mailer: IMailer;
  constructor() {
    this.repo = new UserRepository();
    this.mailer = new NotificationService({
      user: process.env.SMTP_USER as string,
      hostSMTP: process.env.SMTP_HOST as string,
      password: process.env.SMTP_PASSWORD as string,
    });
    this.utilities = new AuthServiceUtilities();
  }

  /**
   * @description registration service
   */
  public get registration() {
    return new Registration(
      this.repo,
      this.utilities,
      jwt,
      bcrypt,
      this.mailer,
      config
    );
  }
  /**
   * @description login service
   */
  public get login() {
    return new LogIn(this.repo, this.utilities, jwt, bcrypt, config);
  }
  /**
   * @description password reset service
   */
  public get resetPass() {
    return new PasswordReset(this.repo, this.mailer, generate, bcrypt, config);
  }
  /**
   * @description fetchprofile service
   */
  public get fetchProfile() {
    return new ViewProfile(this.repo, config);
  }
  /**
   * @description edit profile service
   */
  public get editProfile() {
    return new EditProfile(this.repo, bcrypt, config);
  }
}
