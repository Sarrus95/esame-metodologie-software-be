import { Request, Response, NextFunction, Router } from "express";
import Book from "../models/Book";
import UserTokenVerifier from "../middleware/verification/UserTokenVerifier";
import BookBinder from "../middleware/binder/BookBinder";
import { userTokenValidator } from "../middleware/verification/validators";

const booksRouter = Router();

booksRouter.get("/", async (_, res) => {
  try{
    const books = await Book.find({});
    res.status(200).send(books);
  } catch(e){
    res.status(500).send(e);
  }
})

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