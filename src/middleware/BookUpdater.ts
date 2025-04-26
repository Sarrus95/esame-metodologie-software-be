import { Request, Response, NextFunction } from "express";
import Book from "../models/Book";

const BookUpdater = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookRefId, proposedBookId, status } = req.body.books;
    if (status === "Scambio Accettato") {
      const userPhoneNo = req.body.phoneno;
      await Book.updateMany(
        { _id: { $in: [bookRefId, proposedBookId] } },
        { $set: { status: status, phoneNo: userPhoneNo } }
      );
      res.status(200).json({
        message: "Scambio Accettato!",
      });
    } else {
      await Book.updateMany(
        { _id: { $in: [bookRefId, proposedBookId] } },
        { $set: { status: status } }
      );
      res.status(200).json({ message: "Scambio Rifiutato!" });
    }
  } catch (e: any) {
    res.status(500).send(e.message);
  }
};

export default BookUpdater;