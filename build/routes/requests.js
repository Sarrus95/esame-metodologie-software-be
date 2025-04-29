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
const User_1 = __importDefault(require("../models/User"));
const BookRequest_1 = __importDefault(require("../models/BookRequest"));
const validators_1 = require("../middleware/verification/validators");
const BookUpdater_1 = __importDefault(require("../middleware/BookUpdater"));
const UserTokenVerifier_1 = __importDefault(require("../middleware/verification/UserTokenVerifier"));
const bookRequestsRouter = (0, express_1.Router)();
bookRequestsRouter.post("/send-request", validators_1.userTokenValidator, UserTokenVerifier_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userRef, bookRef, senderRef, senderBook } = req.body;
        const request = yield BookRequest_1.default.create(req.body);
        yield User_1.default.findByIdAndUpdate(userRef, {
            $push: { receivedRequests: request },
        });
        yield User_1.default.findByIdAndUpdate(senderRef, {
            $push: { sentRequests: request },
        });
        req.body.books = {
            bookRefId: bookRef,
            senderBookId: senderBook,
            status: "Scambio In Corso",
        };
        next();
    }
    catch (e) {
        res.status(500).send(e.message);
    }
}), BookUpdater_1.default);
bookRequestsRouter.patch("/:id", validators_1.userTokenValidator, UserTokenVerifier_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestAccepted = req.headers.requestresponse;
        const { _id, userRef, bookRef, senderRef, senderBook } = req.body;
        req.body.books = {
            bookRefId: bookRef,
            senderBookId: senderBook,
        };
        if (requestAccepted === "true") {
            const userPhoneNo = req.headers.phoneno;
            const request = yield BookRequest_1.default.findByIdAndUpdate(_id, {
                status: "Accettata",
                phoneNo: userPhoneNo
            }, { new: true });
            yield User_1.default.updateMany({ _id: { $in: [userRef, senderRef] } }, { $push: { storedRequests: request } });
            req.body.books.status = "Scambio Accettato";
        }
        else {
            const request = yield BookRequest_1.default.findByIdAndUpdate(_id, {
                status: "Rifiutata",
            }, { new: true });
            yield User_1.default.updateMany({ _id: { $in: [userRef, senderRef] } }, { $push: { storedRequests: request } });
            req.body.books.status = "In Attesa Di Scambio";
        }
        next();
    }
    catch (e) {
        res.status(500).send(e.message);
    }
}), BookUpdater_1.default);
exports.default = bookRequestsRouter;
