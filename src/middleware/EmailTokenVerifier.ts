import { Request, Response, NextFunction } from "express";
import User from "../models/User";

const EmailTokenVerifier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await User.findOne({
      emailAuthToken: req.params.token,
      emailVerified: false,
    });
    if (result) {
      next();
    } else {
      res.status(401).send("Invalid Token!");
    }
  } catch (e) {
    res.status(500).send(e);
  }
};

export default EmailTokenVerifier;