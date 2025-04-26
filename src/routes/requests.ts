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
      const request = await BookRequest.create(req.body);
      await User.findByIdAndUpdate(request.userRef, {
        $push: { receivedRequests: request },
      });
      await User.findByIdAndUpdate(request.senderRef, {
        $push: { sentRequests: request },
      });
      req.body.books = {
        bookRefId: request.bookRef.toString(),
        proposedBookId: request.senderBook.toString(),
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
      const requestId = req.params.id;
      const requestAccepted = req.headers.requestresponse;
      const { bookRef, proposedBook } = req.body;
      req.body.books = {
        bookRefId: bookRef,
        proposedBookId: proposedBook,
      };
      if (requestAccepted === "true") {
        const request = await BookRequest.findByIdAndUpdate(
          requestId,
          {
            status: "Accettata",
          },
          { new: true }
        );
        await User.updateMany(
          { _id: { $in: [proposedBook.ownerId, bookRef.ownerId] } },
          { $push: { storedRequests: request } }
        );
        req.body.books.status = "Scambio Accettato";
      } else {
        const request = await BookRequest.findByIdAndUpdate(
          requestId,
          {
            status: "Rifiutata",
          },
          { new: true }
        );
        await User.updateMany(
          { _id: { $in: [proposedBook.ownerId, bookRef.ownerId] } },
          { $push: { storedRequests: request } }
        );
        req.body.books.status = "In Attesa Di Scambio";
      }
      next();
    } catch (e) {
      res.status(500).send(e);
    }
  },
  BookUpdater
);

export default bookRequestsRouter;