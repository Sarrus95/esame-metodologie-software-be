import { Request, Response } from "express";
import User from "../../models/User";

const BookBinder = async (req: Request, res: Response) => {
  try {
    await User.findByIdAndUpdate(req.headers.userId, {
      $push: { myBooks: req.headers.bookId },
    });
    res.status(200).send("Book Added!");
  } catch (e) {
    res.status(500).send(e);
  }
};

export default BookBinder;