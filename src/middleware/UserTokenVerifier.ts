import { NextFunction, Request, Response } from "express";
import User from "../models/User";

const UserLoginVerifier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
      const user = await User.findOne({accessToken: authHeader});
      if (user){
        req.body.userId = user._id;
        next();
      }
      else{
        res.status(401).send("Invalid token!");
      }
  }
  else
      res.status(401).send("No token provided!");
};

export default UserLoginVerifier;