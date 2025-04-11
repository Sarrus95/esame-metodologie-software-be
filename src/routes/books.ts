import { Router } from "express";
import Book from "../models/Book";
import UserTokenVerifier from "../middleware/UserTokenVerifier";
import BookBinder from "../middleware/BookBinder";

const booksRouter = Router();

booksRouter.post(
  "/add-book",
  UserTokenVerifier,
  async (req, res, next) => {
    try {
      const newBook = {
        ...req.body,
        ownerId: req.body.userId,
      };
      const book = await Book.create(newBook);
      req.body.bookId = book._id;
      next();
    } catch (e) {
      res.status(500).send(e);
    }
  },
  BookBinder
);

booksRouter.patch("/book/:id", UserTokenVerifier, async (req, res) => {
  try {
    const bookId = req.params.id;
    const bookInfo = req.body;
    await Book.findByIdAndUpdate(bookId, bookInfo);
    res.status(204).send("Book info successfully updated!");
  } catch (e) {
    res.status(500).send(e);
  }
});

export default booksRouter;
