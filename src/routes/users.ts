import { Request, Response, NextFunction, Router } from "express";
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
import UserSignupVerifier from "../middleware/verification/UserSignupVerifier";
import EmailTokenSender from "../middleware/EmailTokenSender";
import { isMarkedAsUntransferable } from "node:worker_threads";

const usersRouter = Router();

usersRouter.post(
  "/signup",
  userRegistrationValidator,
  UserSignupVerifier,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newUser = {
        ...req.body,
        password: hashSync(req.body.password),
        emailAuthToken: uuidv4(),
        loginAuthToken: null,
      };
      await User.create(newUser);
      req.body.userData = newUser;
      next();
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
      const loginAuthToken = uuidv4();
      const userData = await User.findOneAndUpdate(
        { email: req.body.email },
        { loginAuthToken: loginAuthToken }
      );
      if (userData) {
        res.status(200).json({
          message: "Login Successfull!",
          loginAuthToken: loginAuthToken,
          userId: userData._id,
          username: userData.username || "",
          phoneNo: userData.phoneNo || ""
        });
      }
    } catch (e) {
      res.status(500).send(e);
    }
  }
);

usersRouter.patch(
  "/:id",
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

usersRouter.get(
  "/:id/my-books",
  userTokenValidator,
  UserTokenVerifier,
  async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const userInfo = await User.findById(userId).populate("myBooks");
      if (userInfo) {
        res.status(200).json({
          myBooks: userInfo.myBooks,
        });
      }
    } catch (e) {
      res.status(500).send(e);
    }
  }
);

usersRouter.get(
  "/:id/my-interests",
  userTokenValidator,
  UserTokenVerifier,
  async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const userInfo = await User.findById(userId).populate("booksOfInterest");
      if (userInfo) {
        res.status(200).json({
          booksOfInterest: userInfo.booksOfInterest,
        });
      }
    } catch (e: any) {
      res.status(500).send(e.message);
    }
  }
);

export default usersRouter;
