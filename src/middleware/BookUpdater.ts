import { Request, Response, NextFunction } from "express";
import Book from "../models/Book";

const BookUpdater = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookRefId, proposedBookId, status } = req.body.books;
    await Book.updateMany(
      { _id: { $in: [bookRefId, proposedBookId] } },
      { $set: { status: status } }
    );
    if (status === "Scambio Accettato") {
      const userPhoneNo = req.body.phoneno;
      res.status(200).json({
        message: "Scambio Accettato!",
        phoneNo: userPhoneNo,
      });
    } else {

      res.status(200).json({message: "Scambio Rifiutato!"});
    }
  } catch (e) {
    res.status(500).send(e);
  }
};

export default BookUpdater;
