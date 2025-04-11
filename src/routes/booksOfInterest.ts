import { Router } from "express";
import BookOfInterest from "../models/BookOfInterest";
import UserTokenVerifier from "../middleware/UserTokenVerifier";

const booksOfInterestRouter = Router();

booksOfInterestRouter.post("/add-interest",UserTokenVerifier, async (req, res) => {
  try {
    const newBookOfInterest = {
      ...req.body,
      ownerId: req.body.userId
    };
    await BookOfInterest.create(newBookOfInterest);
    res.status(201).send("Book of interest created!");
  } catch (e) {
    res.status(500).send(e);
  }
});

booksOfInterestRouter.patch("/interest/:id",UserTokenVerifier,async (req,res) => {
  try{
    const interestId = req.params.id;
    const interestInfo = req.body;
    await BookOfInterest.findByIdAndUpdate(interestId,interestInfo);
    res.status(204).send("Book of interest info successfully updated!");
  } catch(e) {
    res.status(500).send(e);
  }
})

export default booksOfInterestRouter;