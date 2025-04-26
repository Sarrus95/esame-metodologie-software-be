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
const express_1 = require("express");
const validators_1 = require("../middleware/verification/validators");
const bcrypt_ts_1 = require("bcrypt-ts");
const uuid_1 = require("uuid");
const User_1 = __importDefault(require("../models/User"));
const EmailTokenVerifier_1 = __importDefault(require("../middleware/verification/EmailTokenVerifier"));
const UserLoginVerifier_1 = __importDefault(require("../middleware/verification/UserLoginVerifier"));
const UserTokenVerifier_1 = __importDefault(require("../middleware/verification/UserTokenVerifier"));
const UserSignupVerifier_1 = __importDefault(require("../middleware/verification/UserSignupVerifier"));
const EmailTokenSender_1 = __importDefault(require("../middleware/EmailTokenSender"));
const usersRouter = (0, express_1.Router)();
usersRouter.post("/signup", validators_1.userRegistrationValidator, UserSignupVerifier_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = Object.assign(Object.assign({}, req.body), { password: (0, bcrypt_ts_1.hashSync)(req.body.password), emailAuthToken: (0, uuid_1.v4)(), loginAuthToken: null });
        yield User_1.default.create(newUser);
        req.body.userData = newUser;
        next();
    }
    catch (e) {
        res.status(500).send(e);
    }
}), EmailTokenSender_1.default);
usersRouter.get("/auth-email/:token", validators_1.emailTokenValidator, EmailTokenVerifier_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield User_1.default.findOneAndUpdate({ emailAuthToken: req.params.token }, { emailAuthToken: null, emailVerified: true });
        res.status(200).send("Verification Completed!");
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
usersRouter.post("/login", validators_1.userLoginValidator, UserLoginVerifier_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loginAuthToken = (0, uuid_1.v4)();
        const userData = yield User_1.default.findOneAndUpdate({ email: req.body.email }, { loginAuthToken: loginAuthToken });
        if (userData) {
            res.status(200).json({
                message: "Login Successfull!",
                loginAuthToken: loginAuthToken,
                userId: userData._id,
                username: userData.username || "",
                phoneNo: userData.phoneNo || "",
            });
        }
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
usersRouter.patch("/:id", validators_1.userTokenValidator, UserTokenVerifier_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const userInfo = req.body;
        yield User_1.default.findByIdAndUpdate(userId, userInfo);
        res.status(204).send("User info successfully updated!");
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
usersRouter.get("/:id/my-books", validators_1.userTokenValidator, UserTokenVerifier_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const userInfo = yield User_1.default.findById(userId).populate("myBooks");
        if (userInfo) {
            res.status(200).json({
                myBooks: userInfo.myBooks,
            });
        }
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
usersRouter.get("/:id/my-interests", validators_1.userTokenValidator, UserTokenVerifier_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const userInfo = yield User_1.default.findById(userId).populate("booksOfInterest");
        if (userInfo) {
            res.status(200).json({
                booksOfInterest: userInfo.booksOfInterest,
            });
        }
    }
    catch (e) {
        res.status(500).send(e.message);
    }
}));
usersRouter.get("/:id/my-requests", validators_1.userTokenValidator, UserTokenVerifier_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const userInfo = yield User_1.default.findById(userId)
            .populate({
            path: "sentRequests",
            populate: [
                { path: "userRef", select: "username" },
                { path: "bookRef", select: "title" },
                { path: "senderRef", select: "username" },
                { path: "senderBook", select: "title" },
            ],
        })
            .populate({
            path: "receivedRequests",
            populate: [
                { path: "userRef", select: "username" },
                { path: "bookRef", select: "title" },
                { path: "senderRef", select: "username" },
                { path: "senderBook", select: "title" },
            ],
        })
            .populate({
            path: "storedRequests",
            populate: [
                { path: "userRef", select: "username" },
                { path: "bookRef", select: "title" },
                { path: "senderRef", select: "username" },
                { path: "senderBook", select: "title" },
            ],
        });
        if (userInfo) {
            res.status(200).json({
                sentRequests: userInfo.sentRequests,
                receivedRequests: userInfo.receivedRequests,
                storedRequests: userInfo.storedRequests,
            });
        }
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
exports.default = usersRouter;
