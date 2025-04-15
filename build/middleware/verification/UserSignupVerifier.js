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
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("../../models/User"));
const UserSignupVerifier = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const check = (0, express_validator_1.validationResult)(req);
    if (check.isEmpty()) {
        const duplicateUser = yield User_1.default.findOne({ email: req.body.email });
        if (!duplicateUser) {
            next();
        }
        else {
            res.status(409).send("User Already Registered!");
        }
    }
    else {
        res.status(404).send("Invalid User Input");
    }
});
exports.default = UserSignupVerifier;
