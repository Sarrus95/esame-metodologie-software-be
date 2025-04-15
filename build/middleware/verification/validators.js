"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestValidator = exports.userTokenValidator = exports.userLoginValidator = exports.emailTokenValidator = exports.userRegistrationValidator = void 0;
const express_validator_1 = require("express-validator");
exports.userRegistrationValidator = [
    (0, express_validator_1.body)("username").trim().notEmpty().isString(),
    (0, express_validator_1.body)("email").trim().notEmpty().isEmail(),
    (0, express_validator_1.body)("password").trim().notEmpty().isStrongPassword({
        minLength: 8
    })
];
exports.emailTokenValidator = [
    (0, express_validator_1.param)("token").trim().isUUID()
];
exports.userLoginValidator = [
    (0, express_validator_1.body)("username").trim().notEmpty().isString(),
    (0, express_validator_1.body)("password").trim().notEmpty().isStrongPassword({
        minLength: 8
    })
];
exports.userTokenValidator = [
    (0, express_validator_1.header)("authorization").isUUID()
];
exports.requestValidator = [
    (0, express_validator_1.body)("userRef").notEmpty().isString(),
    (0, express_validator_1.body)("bookRed").notEmpty().isString()
];
