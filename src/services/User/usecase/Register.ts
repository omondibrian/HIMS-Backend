import { UserDto } from "@HIHM/src/DTOs/UserDTO";
import { ResultPayload } from "@HIHM/src/lib/utilities/result";
import { IAuthserviceUtilities } from "@HIHM/src/lib/utilities/validation/auth_service_utilities";
import { IRepository } from "@Repositories/UserRepository";
import { IMailer } from "@Services/email";

export class Registration {
  constructor(
    private readonly repo: IRepository,
    private readonly utility: IAuthserviceUtilities,
    private readonly jwt: any,
    private readonly bcrypt: any,
    private readonly mailer: IMailer,
    private readonly config: any
  ) {}
  async registeruser(
    newUser: UserDto
  ): Promise<
    ResultPayload<{ message: string }> | ResultPayload<Error> | undefined
  > {
    try {
      //validate the user input
      const { error } = this.utility.registrationValidation(newUser);
      if (error) throw new Error(`${error.details[0].message}`);

      //check if the email already exists
      const user = await this.repo.find({
        field: "email",
        value: newUser.email,
      });
      if (user) throw new Error("email already exists");

      //encrpte the password
      const encrptedPass = await this.bcrypt.hash(newUser.password, 10);
      //create a new user
      const savedUser = await this.repo.insert({
        name: newUser.name,
        email: newUser.email,
        password: encrptedPass,
        BackGroundImg: newUser.BackGroundImg,
        profilePic: newUser.profilePic,
        Type: newUser.Type,
      });
      if (!savedUser) throw new Error("cannot send mail to user of undefined");
      
      const payload = { email: savedUser.email };
      const secreateToken = this.jwt.sign(payload, process.env.SECREATE_TOKEN);
      //compose an email
      const html = `
          Congrats  ${savedUser.name},<br/>
          You have successfully created your HIMS Account
          please follow the link below to activate your account<br/>
          <a href='${process.env.BACKEND_IP}/auth/verify/${secreateToken}'>Verify</a><br/><br/>
          Have a nice day.🙋🙋<br/>
          <small>this is an automated email</small>
          `;
      //send the email
      console.log(savedUser);
      await this.mailer.send({
        to: savedUser.email,
        from: process.env.Email as string,
        body: html,
        subject: "HIMS Verification Token 🐝🐝",
        text: html,
      });
      const result = {
        message: "registration sucessfull please check your email",
      };

      return new ResultPayload<{ message: string }>(result, 200);
    } catch (error: any) {
      /* istanbul ignore else */
      const msg =
        this.config().env !== "production"
          ? error.message
          : "unable to register new user at the moment please try again";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
