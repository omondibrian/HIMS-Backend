import User from "@Entities/user.entity";
import { ResultPayload } from "@HIHM/src/lib/utilities/result";
import { IAuthserviceUtilities } from "@HIHM/src/lib/utilities/validation/auth_service_utilities";
import { IUserRepository } from "@Repositories/UserRepository";

export class LogIn {
  constructor(
    private readonly repo: IUserRepository,
    private readonly utility: IAuthserviceUtilities,
    private readonly jwt: any,
    private readonly bcrypt: any,
    private readonly config: any
  ) {}

  public async login(credentials: {
    email: string;
    password: string;
  }): Promise<
    | ResultPayload<{ message: string; token: string }>
    | ResultPayload<Error>
    | undefined
  > {
    try {
      // TODO:catch execeptions in the main user's service route

      // validate the user input
      const { error } = this.utility.loginValidation(credentials);
      if (error) { throw new Error(`${error.details[0].message}`); }
      let user: User | undefined;
      try {
        // check if the email passed exists doesn't exists
        user = await this.repo.find({
          field: "email",
          value: credentials.email,
        });
      } catch (error: any) {
        const msg =
          this.config().env !== "production"
            ? error.message
            : "unable to login at the moment please try again";
        throw new Error(msg);
      }
      if (!user) { throw new Error("Error authenticating please try again !"); }
      // check if password is correct
      const validPass = await this.bcrypt.compare(
        credentials.password,
        user.password
      );
      if (!validPass) {
        throw new Error("Error authenticating please try again !");
      }

      // todo:check if account is active
      // if (!user.isActive)
      //   return {
      //     message:
      //       "Access Denied 👺👺 - This account has been temporarily been disabled .Please activate your account",
      //   };

      // create and assign an authentification token
      const token = this.jwt.sign(
        { _id: user._id },
        process.env.SECREATE_TOKEN
      );

      const result = { message: "login sucessfull", token };
      return new ResultPayload<{ message: string; token: string }>(result, 200);
    } catch (error: any) {
      const msg = error.message;
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
