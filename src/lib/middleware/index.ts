/**
 * @fileOverview contains all the custom middleware used in the application
 * @author Brian Omondi
 * @version 0.0.1
 */

import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { UserServiceProvider } from "@HIHM/src/services/User";
import { ResultPayload } from "../utilities/result";
import { UserDto } from "@HIHM/src/DTOs/UserDTO";
export interface RequestModel extends Request {
  UserId: string;
  userMode: boolean;
}
export const TokenMiddleware = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("AUTH_TOKEN");
  if (!token) return res.status(401).send("ACCESS DENIED");

  try {
    const verifiedToken: any = jwt.verify(
      token,
      process.env.SECREATE_TOKEN as string
    );
    req.UserId = verifiedToken._id as string;

    next();
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
};

export const UserMode = async (req: any, res: Response, next: NextFunction) => {
  const userUsecase = new UserServiceProvider();
  try {
    const user = (await userUsecase.fetchProfile.profile(
      req.UserId
    )) as ResultPayload<UserDto>;
    if (user?.getResult().payload?.Type === "Inspector") {
      req.userMode = true;
    } else {
      req.userMode = false;
    }
    next();
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
};


export const BeeKeeperMode = async (req: any, res: Response, next: NextFunction) => {
    const userUsecase = new UserServiceProvider();
    try {
      const user = (await userUsecase.fetchProfile.profile(
        req.UserId
      )) as ResultPayload<UserDto>;
      if (user?.getResult().payload?.Type !== "BeeKeeper") {
        res.status(401).send("Unauthorised Access");
      }
      next();
    } catch (error) {
      res.status(400).send("Invalid Token");
    }
  };
