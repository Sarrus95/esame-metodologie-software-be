import { Request, Response, NextFunction } from 'express';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.OUTLOOK_HOST,
    port: 587,
    secure: false,
    auth: {
        user: process.env.OUTLOOK_HOST,
        pass: process.env.OUTLOOK_PASS
    }
})

const EmailTokenSender = async(req: Request,res: Response,next: NextFunction) => {
    try{
        if(process.env.BASE_URL && process.env.EMAIL_AUTH_URL){
            const checkUrl = process.env.BASE_URL + process.env.EMAIL_AUTH_URL + req.body.userData.emailAuthToken;
            const info = await transporter.sendMail({
                from:"BookShareApp Test <rosariozago@outlook.it>",
                to:`${req.body.userData.email}`,
                subject: "Verify your email",
                text: `Verify your email, click on the following link:${checkUrl}`,
                html: `<b>Verify your email, click on the following link:${checkUrl}<b>`
            })
            if(info){
                res.status(201).send("User created!");
            }
            else{
                res.status(500).send("Internal Server Error!");
            }
        }
    } catch(e){
        res.status(500).send(e);
    }
}

export default EmailTokenSender;