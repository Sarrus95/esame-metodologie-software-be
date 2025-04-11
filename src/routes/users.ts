import { Router } from "express";
import { hashSync } from "bcrypt-ts";
import { v4 as uuidv4 } from "uuid";
import User from "../models/User";
import EmailTokenVerifier from "../middleware/EmailTokenVerifier";
import UserLoginVerifier from "../middleware/UserLoginVerifier";
import UserTokenVerifier from "../middleware/UserTokenVerifier";

const usersRouter = Router();

usersRouter.post("/signup", async (req, res) => {
  try {
    const newUser = {
      ...req.body,
      password: hashSync(req.body.password),
      emailAuthToken: uuidv4(),
      loginAuthToken: null
    };
    await User.create(newUser);
    res.status(201).send("User Created!");
  } catch (e) {
    res.status(500).send(e);
  }
});

usersRouter.get("/auth-email/:token", EmailTokenVerifier, async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { emailAuthToken: req.params.token },
      { emailAuthToken: null, emailVerified: true }
    );
    res.status(200).send("Verification Completed!");
  } catch (e) {
    res.status(500).send(e);
  }
});

usersRouter.post("/login", UserLoginVerifier, async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { username: req.body.username },
      { loginAuthToken: uuidv4() }
    );
    res.status(200).send("Login Successfully!");
  } catch (e) {
    res.status(500).send(e);
  }
});

usersRouter.patch("/user/:id",UserTokenVerifier,async (req,res) => {
  try{
    const userId = req.params.id;
    const userInfo = req.body;
    await User.findByIdAndUpdate(userId,userInfo);
    res.status(204).send("User info successfully updated!");
  } catch(e) {
    res.status(500).send(e);
  }
})

export default usersRouter;