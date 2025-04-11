import { Request, Response, NextFunction } from "express";
import { compareSync } from "bcrypt-ts";
import User from "../models/User";

const UserLoginVerifier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userExists = await User.findOne({
      username: req.body.username,
      emailVerified: true,
    });
    if (userExists) {
      const passwordCorrect = compareSync(
        req.body.password,
        userExists.password
      );
      if (passwordCorrect) {
        next();
      } else {
        res.status(401).send("Invalid Credentials!");
      }
    }
  } catch (e) {
    res.status(500).send(e);
  }
};

export default UserLoginVerifier;
