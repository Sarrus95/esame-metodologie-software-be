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
const Book_1 = __importDefault(require("../models/Book"));
const BookUpdater = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookRefId, proposedBookId, status } = req.body.books;
        yield Book_1.default.updateMany({ _id: { $in: [bookRefId, proposedBookId] } }, { $set: { status: status } });
        if (status === "Scambio Accettato") {
            const userPhoneNo = req.body.phoneno;
            res.status(200).json({
                message: "Scambio Accettato!",
                phoneNo: userPhoneNo,
            });
        }
        else {
            res.status(200).send("Scambio Rifiutato!");
        }
    }
    catch (e) {
        res.status(500).send(e);
    }
});
exports.default = BookUpdater;
