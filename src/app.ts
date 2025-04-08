import dotenv from './env/dotenvConfig'; 
import express, { Request, Response } from 'express';
import userRouter from './routes/users';
import connectDB from './config/db';

const app = express();

app.use(express.json());
app.use('/users',userRouter);

app.get('/',(_, res) => { 
    res.send("Server is running!")
})

const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})