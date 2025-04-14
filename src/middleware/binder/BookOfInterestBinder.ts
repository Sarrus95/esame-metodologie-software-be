import { Request, Response, NextFunction } from "express";
import BookOfInterest from "../models/BookOfInterest";


const BookOfInterestBinder = async (req: Request,res: Response,next: NextFunction) => {
    try{
        await BookOfInterest.findByIdAndUpdate(req.body.userId,{booksOfInterest: req.body.bookId})
    }catch(e){
        res.status(500).send(e);
    }
}

export default BookOfInterestBinder;