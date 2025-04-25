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
const BookOfInterest_1 = __importDefault(require("../models/BookOfInterest"));
const UserTokenVerifier_1 = __importDefault(require("../middleware/verification/UserTokenVerifier"));
const validators_1 = require("../middleware/verification/validators");
const BookOfInterestBinder_1 = __importDefault(require("../middleware/binder/BookOfInterestBinder"));
const booksOfInterestRouter = (0, express_1.Router)();
booksOfInterestRouter.post("/add-interest", validators_1.userTokenValidator, UserTokenVerifier_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newBookOfInterest = req.body;
        const bookOfInterest = yield BookOfInterest_1.default.create(newBookOfInterest);
        req.headers["userId"] = newBookOfInterest.userRef;
        req.headers["bookId"] = bookOfInterest.id.toString();
        next();
    }
    catch (e) {
        res.status(500).send(e);
    }
}), BookOfInterestBinder_1.default);
booksOfInterestRouter.put("/:id", UserTokenVerifier_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const interestId = req.params.id;
        const interestInfo = req.body;
        yield BookOfInterest_1.default.findByIdAndUpdate(interestId, interestInfo);
        res.status(204).send("Book of interest info successfully updated!");
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
exports.default = booksOfInterestRouter;
