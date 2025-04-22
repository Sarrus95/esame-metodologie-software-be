import { NextFunction, Request, Response } from "express";
import User from "../../models/User";
import { validationResult } from "express-validator";

const UserLoginVerifier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    const authHeader = req.headers.authorization;
    const user = await User.findOne({ loginAuthToken: authHeader });
    console.log(user);
    if (user) {
      next();
    } else {
      res.status(401).send("Invalid token!");
    }
  } else {
    res.status(401).send("No token provided!");
  }
};

export default UserLoginVerifier;