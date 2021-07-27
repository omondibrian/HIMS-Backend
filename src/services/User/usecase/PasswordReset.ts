import { UserDto } from "@HIHM/src/DTOs/UserDTO";
import User from "@HIHM/src/entities/user.entity";
import { ResultPayload } from "@HIHM/src/lib/utilities/result";
import { IUserRepository } from "@Repositories/UserRepository";
import { IMailer } from "@Services/email";

export class PasswordReset {
  constructor(
    private readonly repo: IUserRepository,
    private readonly mailer: IMailer,
    private readonly generate: any,
    private readonly bcrypt: any,
    private readonly config: any
  ) {}

  public async reset(credentials: {
    email: string;
    newPassword: string;
  }): Promise<
    ResultPayload<{ message: string }> | ResultPayload<Error> | undefined
  > {
    try {
      const user = (await this.repo.find({
        field: "email",
        value: credentials.email,
      })) as User;
      if (!user) { throw new Error("Invalid Email please try again !"); }

      const secreateToken = this.generate(7);
      // encrpte the password
      const salt = await this.bcrypt.genSalt(10);
      const encrptedPass = await this.bcrypt.hash(secreateToken, salt);

      const newUser = new UserDto(
        user.name,
        user.email,
        user.profilePic,
        user.BackGroundImg,
        user.Type,
        encrptedPass
      );
      const result = await this.repo.update(
        { field: "email", value: credentials.email },
        newUser
      );
      if (result) {
        // compose an email
        const html = `
            Hello <strong>${result.name} </strong>,<br/>
            please enter the verification code below to access your account<br/><br/>
            please enter the following token<br/>
            Token:<span style="color:blue;">${secreateToken}</span><br/><br/>
            Have a nice day.
            `;
        // send the email
        await this.mailer.send({
          to: user.email,
          from: process.env.Email as string,
          body: html,
          subject: "Password Reset",
          text: html,
        });

        return new ResultPayload<{ message: string }>(
          { message: "Password Reset was successfull,please check your email" },
          200
        );
      } else {
        throw new Error("Unable to Finish The Operation");
      }
    } catch (error: any) {
      const msg =
        this.config().env !== "production"
          ? error.message
          : "unable to reset password at the moment please try again";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
