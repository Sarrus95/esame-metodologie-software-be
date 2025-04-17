import { Request, Response } from "express";
import Book from "../../models/Book";

const BookBinder = async (req: Request, res: Response) => {
  try {
    await Book.findByIdAndUpdate(req.body.userId, {
      $push: { mybook: req.body.bookId },
    });

    res.status(200).send("Book Added!");
  } catch (e) {
    res.status(500).send(e);
  }
};

export default BookBinder;