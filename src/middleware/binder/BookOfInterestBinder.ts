import { Request, Response } from "express";
import User from "../../models/User";

const BookOfInterestBinder = async (req: Request, res: Response) => {
  try {
    await User.findByIdAndUpdate(req.headers.userId, {
      $push: { booksOfInterest: req.headers.bookId },
    });
    res.status(200).send("Book Of Interest Added!");
  } catch (e) {
    res.status(500).send(e);
  }
};

export default BookOfInterestBinder;