"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_1 = __importDefault(require("nodemailer"));
dotenv_1.default.config();
const EmailTokenSender = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const testAccount = yield nodemailer_1.default.createTestAccount();
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
        if (process.env.BASE_URL && process.env.EMAIL_AUTH_URL) {
            const checkUrl = process.env.BASE_URL +
                process.env.EMAIL_AUTH_URL +
                req.body.userData.emailAuthToken;
            const info = yield transporter.sendMail({
                from: "BookShareApp Test <shyrightsmovement@outlook.it>",
                to: `${req.body.userData.email}`,
                subject: "Verify your email",
                text: `To verify your email,use the following link:${checkUrl}`,
                html: `<b>To verify your email,use the following link</b> <a href="${checkUrl}">${checkUrl}</a>`,
            });
            if (info) {
                res.status(201).json({
                    message: "User created!",
                    activationURL: nodemailer_1.default.getTestMessageUrl(info),
                });
            }
            else {
                res.status(500).send("Internal Server Error!");
            }
        }
    }
    catch (e) {
        res.status(500).send(e);
    }
});
exports.default = EmailTokenSender;
