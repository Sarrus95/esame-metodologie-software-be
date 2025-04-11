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
const Book_1 = __importDefault(require("../models/Book"));
const UserTokenVerifier_1 = __importDefault(require("../middleware/UserTokenVerifier"));
const BookBinder_1 = __importDefault(require("../middleware/BookBinder"));
const booksRouter = (0, express_1.Router)();
booksRouter.post("/add-book", UserTokenVerifier_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newBook = Object.assign(Object.assign({}, req.body), { ownerId: req.body.userId });
        const book = yield Book_1.default.create(newBook);
        req.body.bookId = book._id;
        next();
    }
    catch (e) {
        res.status(500).send(e);
    }
}), BookBinder_1.default);
booksRouter.patch("/book/:id", UserTokenVerifier_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.id;
        const bookInfo = req.body;
        yield Book_1.default.findByIdAndUpdate(bookId, bookInfo);
        res.status(204).send("Book info successfully updated!");
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
exports.default = booksRouter;
