import dotenv from 'dotenv';
import express from 'express';
import userRouter from './routes/users';
import connectDB from './config/db';

dotenv.config();
const app = express();

app.use(express.json());
app.use('/users',userRouter);

app.get('/',(_, res) => { 
    res.send("Server is running!")
})

const PORT = process.env.PORT;

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})