import { Router, Request, Response, NextFunction } from "express";
import BookOfInterest from "../models/BookOfInterest";
import UserTokenVerifier from "../middleware/verification/UserTokenVerifier";
import { userTokenValidator } from "../middleware/verification/validators";
import BookOfInterestBinder from "../middleware/binder/BookOfInterestBinder";

const booksOfInterestRouter = Router();

booksOfInterestRouter.post(
  "/add-interest",
  userTokenValidator,
  UserTokenVerifier,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newBookOfInterest = req.body;
      const bookOfInterest = await BookOfInterest.create(newBookOfInterest);
      req.headers["userId"] = newBookOfInterest.userRef;
      req.headers["bookId"] = bookOfInterest.id.toString();
      next();
    } catch (e) {
      res.status(500).send(e);
    }
  },BookOfInterestBinder
);

booksOfInterestRouter.put("/:id", UserTokenVerifier, async (req, res) => {
  try {
    const interestId = req.params.id;
    const interestInfo = req.body;
    await BookOfInterest.findByIdAndUpdate(interestId, interestInfo);
    res.status(204).send("Book of interest info successfully updated!");
  } catch (e) {
    res.status(500).send(e);
  }
});

export default booksOfInterestRouter;