import { Router } from "express";
import User from "../models/User";
import Request from "../models/Request";

const requestsRouter = Router();

requestsRouter.post("send-request/", async (req, res) => {
  const user = await User.findByIdAndUpdate(req.body.userRef, {
    receivedRequests: await Request.create(req.body.receivedRequests),
  });
});

export default requestsRouter;
