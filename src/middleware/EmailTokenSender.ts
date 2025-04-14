import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import nodemailer from "nodemailer";
dotenv.config();


const EmailTokenSender = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    if (process.env.BASE_URL && process.env.EMAIL_AUTH_URL) {
      const checkUrl =
        process.env.BASE_URL +
        process.env.EMAIL_AUTH_URL +
        req.body.userData.emailAuthToken;
      const info = await transporter.sendMail({
        from: "BookShareApp Test <shyrightsmovement@outlook.it>",
        to: `${req.body.userData.email}`,
        subject: "Verify your email",
        text: `Verify your email, click on the following link:${checkUrl}`,
        html: `<b>Verify your email, click on the following link:</b> <a href="${checkUrl}">${checkUrl}</a>`,
      });
      if (info) {
        res.status(201).json({
          message: "User created!",
          activationURL: nodemailer.getTestMessageUrl(info),
        });
      } else {
        res.status(500).send("Internal Server Error!");
      }
    }
  } catch (e) {
    res.status(500).send(e);
  }
};

export default EmailTokenSender;
