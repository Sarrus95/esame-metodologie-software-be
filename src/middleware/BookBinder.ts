import { Request, Response, NextFunction } from "express";
import Book from "../models/Book";

const BookBinder = async (req: Request,res: Response,next: NextFunction) => {
    try{
        await Book.findByIdAndUpdate(req.body.userId,{mybook: req.body.bookId})
    }catch(e){
        res.status(500).send(e);
    }
}

export default BookBinder;