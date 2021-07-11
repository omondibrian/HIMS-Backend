import { TYPES } from "@HIHM/src/constants/Types";
import { UserDto } from "@HIHM/src/DTOs/UserDTO";
import { UserServiceProvider } from "@HIHM/src/services/User";
import { EditProfile } from "@Services/User/usecase/EditProfile";
import { LogIn } from "@Services/User/usecase/LogIn";
import { PasswordReset } from "@Services/User/usecase/PasswordReset";
import { Registration } from "@Services/User/usecase/Register";
import { ViewProfile } from "@Services/User/usecase/ViewProfile";
import express from "express";
import { inject } from "inversify";
import {
  controller,
  httpGet,
  httpPost,
  httpPut,
  interfaces,
} from "inversify-express-utils";

@controller("api/v1/auth")
export default class AuthController implements interfaces.Controller {
  private readonly registerUsecase: Registration;
  private readonly login: LogIn;
  private readonly resetPass: PasswordReset;
  private readonly fetchProfile: ViewProfile;
  private readonly editProfile: EditProfile;

  constructor(
    @inject(TYPES.UserServiceProvider) serviceProvider: UserServiceProvider
  ) {
    this.registerUsecase = serviceProvider.registration;
    this.login = serviceProvider.login;
    this.resetPass = serviceProvider.resetPass;
    this.fetchProfile = serviceProvider.fetchProfile;
    this.editProfile = serviceProvider.editProfile;
  }
/**
 * @openapi
 * definitions:
 *  User:
 *   type: object
 *   properties:
 *      name:
 *       type: string
 *       description:  user name
 *       example: 'John Doe'
 *      email:
 *       type: string
 *       description:  user email
 *       example: 'Johndoe@test.com'
 *      profilePic:
 *       type: string
 *       description:  user's profile picture url
 *       example: '/uploads/example.jpg'
 *      BackGroundImg:
 *       type: string
 *       description:  user's backgroung picture url
 *       example: '/uploads/example.jpg'
 *      password:
 *       type: string
 *       description:  user's password
 *       example: 'password'
 *      type:
 *       type: string
 *       description:  user's occupational i.e Bee Keeper or Inspector
 *       example: 'BeeKeeper'
 *
 *
 * /api/v1/auth/register:
 *   post:
 *     description: initiates registration process
 *     consumes:
 *      - application/json
 *     parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        schema:
 *         $ref: '#/definitions/User'
 *
 *     requestBody:
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/definitions/User'
 *       multipart/form-data:
 *        schema:
 *         $ref: '#/definitions/User'
 *     responses:
 *      200:
 *       description: registration sucessfull please check your email
 *      500:
 *       description: registration unsucessfull please retry
 */
  @httpPost("/register")
  public async register(req: express.Request, res: express.Response) {
    const { name, email, password, type, profilePic, backGroundImg } = req.body;

    const newUser = new UserDto(
      name,
      email,
      profilePic,
      backGroundImg,
      type,
      password
    );
    const result = await this.registerUsecase.registeruser(newUser);
    res.status(result!.status).json({
      users: result!.getResult().payload,
      message: result!.getResult().message,
    });
  }
/**
 * @openapi
 * definitions:
 *  loginParams:
 *   type: object
 *   properties:
 *      email:
 *       type: string
 *       description:  user's email
 *       required: true
 *       example: 'Johndoe@test.com'
 *      password:
 *       type: string
 *       description:  user's password
 *       required: true
 *       example: 'secreate password'
 * /api/v1/auth/login:
 *   post:
 *     description: initiates local login process
 *     parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        schema:
 *         $ref: '#/definitions/loginParams'
 *     requestBody:
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/definitions/loginParams'
 *     responses:
 *      200:
 *       description:  sucessfully logged in
 *      401:
 *       description: access denied
 *      500:
 *       description: internal server error
 *
 */
  @httpPost("/login")
  public async loginRoute(req: express.Request, res: express.Response) {
    const result = await this.login.login(req.body);
    res.status(result!.status).json({
      users: result!.getResult().payload,
      message: result!.getResult().message,
    });
  }
/**
 * @openapi
 *
 *
 * /api/v1/auth/edit:
 *   post:
 *     description: edit user profile
 *     consumes:
 *      - application/json
 *     parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        schema:
 *         $ref: '#/definitions/User'
 *
 *     requestBody:
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/definitions/User'
 *       multipart/form-data:
 *        schema:
 *         $ref: '#/definitions/User'
 *     responses:
 *      200:
 *       description: sucessfully updated your profile
 *      500:
 *       description: profile update unsucessfull please retry
 */
  @httpPut("/edit")
  public async Edit(req: express.Request, res: express.Response) {
    const result = await this.editProfile.update(req.UserId, req.body);
    res.status(result!.status).json({
      users: result!.getResult().payload,
      message: result!.getResult().message,
    });
  }
  /**
   * @openapi
   * definitions:
   *  forgotpass:
   *   type: object
   *   properties:
   *      email:
   *       type: string
   *       description:  user's email
   *       required: true
   *       example: 'Johndoe@test.com'
   * /api/v1/auth/password-reset:
   *   post:
   *    description: reset's user password
   *    parameters:
   *     - in: body
   *       name: body
   *       required: true
   *       schema:
   *        $ref: '#/definitions/forgotpass'
   *    requestBody:
   *     content:
   *      application/json:
   *       schema:
   *        $ref: '#/definitions/forgotpass'
   *    responses:
   *      200:
   *       description:  sucessfull reset password please check your email
   *      500:
   *       description: password reset unsucessfull please retry
   *
   */
  @httpPost("/password-reset")
  public async Reset(req: express.Request, res: express.Response) {
    const result = await this.resetPass.reset(req.body);
    res.status(result!.status).json({
      users: result!.getResult().payload,
      message: result!.getResult().message,
    });
  }

  /**
   * @openapi
   * /api/v1/auth/profile:
   *   get:
   *     description: fetch user profile data
   *     parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        type: interger
   *        example: 1
   *        description: id of the user
   *     responses:
   *      200:
   *       description: profile retrival successfull
   *      500:
   *       description: error retriving user profile
   */
  @httpGet("/profile")
  public async getProfileData(req: express.Request, res: express.Response) {
    const result = await this.fetchProfile.profile(req.UserId);
    res.status(result!.status).json({
      users: result!.getResult().payload,
      message: result!.getResult().message,
    });
  }
}
