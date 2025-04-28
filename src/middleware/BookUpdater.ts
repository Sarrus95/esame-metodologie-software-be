import { Request, Response, NextFunction } from "express";
import Book from "../models/Book";

const BookUpdater = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookRefId, senderBookId, status } = req.body.books;
    if (status === "Scambio Accettato") {
      await Book.updateMany(
        { _id: { $in: [bookRefId, senderBookId] } },
        { $set: { status: status} }
      );
      res.status(200).json({
        message: "Scambio Accettato!",
      });
    } else {
      await Book.updateMany(
        { _id: { $in: [bookRefId, senderBookId] } },
        { $set: { status: status } }
      );
      res.status(200).json({ message: "Scambio Rifiutato!" });
    }
  } catch (e: any) {
    res.status(500).send(e.message);
  }
};

export default BookUpdater;