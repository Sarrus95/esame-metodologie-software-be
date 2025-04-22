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
const bcrypt_ts_1 = require("bcrypt-ts");
const User_1 = __importDefault(require("../../models/User"));
const express_validator_1 = require("express-validator");
const UserLoginVerifier = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const check = (0, express_validator_1.validationResult)(req);
        if (!check.isEmpty()) {
            res.status(401).send("Invalid Credentials!");
        }
        const userExists = yield User_1.default.findOne({
            email: req.body.email,
            emailVerified: true,
        });
        if (!userExists) {
            res.status(401).send("Invalid Credentials!");
        }
        else {
            const passwordCorrect = (0, bcrypt_ts_1.compareSync)(req.body.password, userExists.password);
            if (!passwordCorrect) {
                res.status(401).send("Invalid Credentials!");
            }
            next();
        }
    }
    catch (e) {
        res.status(500).send(e);
    }
});
exports.default = UserLoginVerifier;
