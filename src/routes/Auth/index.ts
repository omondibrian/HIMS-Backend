import { UserDto } from "@HIHM/src/DTOs/UserDTO";
import { TokenMiddleware } from "@HIHM/src/lib/middleware";
import { UserServiceProvider } from "@Services/User";
import { Router } from "express";

const userRoutes = Router();

const serviceProvider: UserServiceProvider = new UserServiceProvider();
const registerUsecase = serviceProvider.registration;
const login = serviceProvider.login;
const resetPass = serviceProvider.resetPass;
const fetchProfile = serviceProvider.fetchProfile;
const editProfile = serviceProvider.editProfile;

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
userRoutes.post("/register", async (req, res) => {
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send("No files were uploaded.");
    return;
  }
  const { name, email, password, Type } = req.body;
  const profilePic: any = req.files?.profilePic;
  const BackGroundImg: any = req.files?.BackGroundImg;
  uploadPath = "uploads/";
  profilePic.mv(uploadPath + Date.now() + profilePic.name);
  BackGroundImg.mv(uploadPath + Date.now() + BackGroundImg.name);
  const newUser = new UserDto(
    name,
    email,
    uploadPath + Date.now() + profilePic.name,
    uploadPath + Date.now() + BackGroundImg.name,
    Type,
    password
  );
  const result = await registerUsecase.registeruser(newUser);
  res.status(result!.status).json({
    user: result!.getResult().payload,
    message: result!.getResult().message,
  });
});

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
userRoutes.post("/login", async (req, res) => {
  const result = await login.login(req.body);
  res.status(result!.status).json({
    user: result!.getResult().payload,
    message: result!.getResult().message,
  });
});

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
userRoutes.put("/edit", TokenMiddleware, async (req, res) => {
  const result = await editProfile.update(req.UserId, {
    ...req.body,
    ...req.files,
  });
  res.status(result!.status).json({
    user: result!.getResult().payload,
    message: result!.getResult().message,
  });
});

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
userRoutes.post("/password-reset", async (req, res) => {
  const result = await resetPass.reset(req.body);
  res.status(result!.status).json({
    user: result!.getResult().payload,
    message: result!.getResult().message,
  });
});

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
userRoutes.get("/profile", TokenMiddleware, async (req, res) => {
  const result = await fetchProfile.profile(req.UserId);
  res.status(result!.status).json({
    user: result!.getResult().payload,
    message: result!.getResult().message,
  });
});

export default userRoutes;
