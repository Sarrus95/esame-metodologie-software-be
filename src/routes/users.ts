import { Request, Response, NextFunction, Router } from "express";
import { validationResult } from "express-validator";
import {
  emailTokenValidator,
  userLoginValidator,
  userRegistrationValidator,
  userTokenValidator,
} from "../middleware/verification/validators";
import { hashSync } from "bcrypt-ts";
import { v4 as uuidv4 } from "uuid";
import User from "../models/User";
import EmailTokenVerifier from "../middleware/verification/EmailTokenVerifier";
import UserLoginVerifier from "../middleware/verification/UserLoginVerifier";
import UserTokenVerifier from "../middleware/verification/UserTokenVerifier";
import EmailTokenSender from "../middleware/EmailTokenSender";

const usersRouter = Router();

usersRouter.post(
  "/signup",
  userRegistrationValidator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const check = validationResult(req.body);
      if (check) {
        const newUser = {
          ...req.body,
          password: hashSync(req.body.password),
          emailAuthToken: uuidv4(),
          loginAuthToken: null,
        };
        await User.create(newUser);
        req.body.userData = newUser;
        next();
      }
    } catch (e) {
      res.status(500).send(e);
    }
  },
  EmailTokenSender
);

usersRouter.get(
  "/auth-email/:token",
  emailTokenValidator,
  EmailTokenVerifier,
  async (req: Request, res: Response) => {
    try {
      await User.findOneAndUpdate(
        { emailAuthToken: req.params.token },
        { emailAuthToken: null, emailVerified: true }
      );
      res.status(200).send("Verification Completed!");
    } catch (e) {
      res.status(500).send(e);
    }
  }
);

usersRouter.post(
  "/login",
  userLoginValidator,
  UserLoginVerifier,
  async (req: Request, res: Response) => {
    try {
      const userInfo = await User.findOneAndUpdate(
        { username: req.body.username },
        { loginAuthToken: uuidv4() }
      );
      res.status(200).json({
        message: "Login Successfull!",
        userToken: userInfo?.loginAuthToken,
      });
    } catch (e) {
      res.status(500).send(e);
    }
  }
);

usersRouter.patch(
  "/user/:id",
  userTokenValidator,
  UserTokenVerifier,
  async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const userInfo = req.body;
      await User.findByIdAndUpdate(userId, userInfo);
      res.status(204).send("User info successfully updated!");
    } catch (e) {
      res.status(500).send(e);
    }
  }
);

export default usersRouter;