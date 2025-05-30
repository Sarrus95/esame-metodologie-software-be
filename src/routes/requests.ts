import { NextFunction, Request, Response, Router } from "express";
import User from "../models/User";
import BookRequest from "../models/BookRequest";
import { userTokenValidator } from "../middleware/verification/validators";
import BookUpdater from "../middleware/BookUpdater";
import UserTokenVerifier from "../middleware/verification/UserTokenVerifier";

const bookRequestsRouter = Router();

bookRequestsRouter.post(
  "/send-request",
  userTokenValidator,
  UserTokenVerifier,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userRef, bookRef, senderRef, senderBook } = req.body;
      const request = await BookRequest.create(req.body);
      await User.findByIdAndUpdate(userRef, {
        $push: { receivedRequests: request },
      });
      await User.findByIdAndUpdate(senderRef, {
        $push: { sentRequests: request },
      });
      req.body.books = {
        bookRefId: bookRef,
        senderBookId: senderBook,
        status: "Scambio In Corso",
      };
      next();
    } catch (e: any) {
      res.status(500).send(e.message);
    }
  },
  BookUpdater
);

bookRequestsRouter.patch(
  "/:id",
  userTokenValidator,
  UserTokenVerifier,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestAccepted = req.headers.requestresponse;
      const { _id, userRef, bookRef, senderRef, senderBook } = req.body;
      req.body.books = {
        bookRefId: bookRef,
        senderBookId: senderBook,
      };
      if (requestAccepted === "true") {
        const userPhoneNo = req.headers.phoneno;
        const request = await BookRequest.findByIdAndUpdate(
          _id,
          {
            status: "Accettata",
            phoneNo: userPhoneNo
          },
          { new: true }
        );
        await User.updateMany(
          { _id: { $in: [userRef, senderRef] } },
          { $push: { storedRequests: request } }
        );
        req.body.books.status = "Scambio Accettato";
      } else {
        const request = await BookRequest.findByIdAndUpdate(
          _id,
          {
            status: "Rifiutata",
          },
          { new: true }
        );
        await User.updateMany(
          { _id: { $in: [userRef, senderRef] } },
          { $push: { storedRequests: request } }
        );
        req.body.books.status = "In Attesa Di Scambio";
      }
      next();
    } catch (e: any) {
      res.status(500).send(e.message);
    }
  },
  BookUpdater
);

export default bookRequestsRouter;