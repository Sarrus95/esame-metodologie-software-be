import { Request, Response, NextFunction, Router } from "express";
import Book from "../models/Book";
import UserTokenVerifier from "../middleware/verification/UserTokenVerifier";
import BookBinder from "../middleware/binder/BookBinder";
import { userTokenValidator } from "../middleware/verification/validators";
import Filter from "../types/filterInterface";

const booksRouter = Router();

booksRouter.get(
  "/",
  userTokenValidator,
  UserTokenVerifier,
  async (req: Request, res: Response) => {
    try {
      const { genre, condition, language, search } = req.query;
      const filters: Filter = { status: "In Attesa Di Scambio" };

      if (genre) filters.genre = genre as string;
      if (condition) filters.condition = condition as string;
      if (language) filters.language = language as string;

      let books;
      if (search) {
        books = await Book.find({
          ...filters,
          $or: [
            { title: { $regex: search, $options: "i" } },
            { author: { $regex: search, $options: "i" } }
          ]
        });
      } else {
        books = await Book.find(filters);
      }

      res.status(200).json(books);
    } catch (e) {
      res.status(500).send(e);
    }
  }
);

booksRouter.post(
  "/add-book",
  userTokenValidator,
  UserTokenVerifier,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newBook = {
        ...req.body,
        ownerId: req.headers.userId,
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

booksRouter.put(
  "/book/:id",
  userTokenValidator,
  UserTokenVerifier,
  async (req: Request, res: Response) => {
    try {
      const bookId = req.params.id;
      const bookInfo = req.body;
      await Book.findByIdAndUpdate(bookId, bookInfo);
      res.status(204).send("Book info successfully updated!");
    } catch (e) {
      res.status(500).send(e);
    }
  }
);

export default booksRouter;