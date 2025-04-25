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
      const sendingUserId = req.headers.userid;
      const request = await BookRequest.create(req.body);
      await User.findByIdAndUpdate(request.userRef, {
        $push: { receivedRequests: request },
      });
      await User.findByIdAndUpdate(sendingUserId, {
        $push: { sentRequests: request },
      });
      req.body.books = {
        bookRefId: request.bookRef.toString(),
        proposedBookId: request.proposedBook.toString(),
        status: "Scambio In Corso",
      };
      next();
    } catch (e) {
      res.status(500).send(e);
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
      const requestId = req.params.id;
      const requestAccepted = req.headers.requestresponse;
      const { bookRef, proposedBook } = req.body;
      req.body.books = {
        bookRefId: bookRef,
        proposedBookId: proposedBook,
      };
      console.log(requestAccepted);
      if (requestAccepted === "true") {
        await BookRequest.findByIdAndUpdate(requestId, { status: "Accettata" });
        req.body.books.status = "Scambio Accettato";
      } else {
        await BookRequest.findByIdAndUpdate(requestId, { status: "Rifutata" });
        req.body.books.status = "In Attesa Di Scambio";
      }
      console.log(req.body.books)
      next();
    } catch (e) {
      res.status(500).send(e);
    }
  },
  BookUpdater
);

export default bookRequestsRouter;
