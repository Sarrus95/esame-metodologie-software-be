import { Request, Response, NextFunction } from "express";
import { compareSync } from "bcrypt-ts";
import User from "../../models/User";
import { validationResult } from "express-validator";

const UserLoginVerifier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const check = validationResult(req);
    if (!check.isEmpty()) {
      res.status(401).send("Invalid Credentials!");
    }
    const userExists = await User.findOne({
      username: req.body.username,
      emailVerified: true,
    });
    if (!userExists) {
      res.status(401).send("Invalid Credentials!");
    }
    else{
      const passwordCorrect = compareSync(
        req.body.password,
        userExists.password
      );
      if (!passwordCorrect){
        res.status(401).send("Invalid Credentials!")
      }
      next();
    }
  } catch (e) {
    res.status(500).send(e);
  }
};

export default UserLoginVerifier;
