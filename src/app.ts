import dotenv from 'dotenv';
import express from 'express';
import userRouter from './routes/users';
import connectDB from './config/db';
import booksRouter from './routes/books';
import booksOfInterestRouter from './routes/booksOfInterest';

dotenv.config();
const app = express();

app.use(express.json());
app.use('/users',userRouter);
app.use("/books",booksRouter);
app.use("/books-of-interest",booksOfInterestRouter)

app.get('/',(_, res) => { 
    res.send("Server is running!")
})

const PORT = process.env.PORT;

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})