import { body,header,param } from "express-validator";

export const userRegistrationValidator = [
    body("email").trim().notEmpty().isEmail(),
    body("password").trim().notEmpty().isStrongPassword({
        minLength: 8
    })
]

export const emailTokenValidator = [
    param("token").trim().isUUID()
]

export const userLoginValidator = [
    body("username").trim().notEmpty().isString(),
    body("password").trim().notEmpty().isStrongPassword({
        minLength: 8
    }
    )
]

export const userTokenValidator = [
    header("authorization").isUUID()
]

export const requestValidator = [
    body("userRef").notEmpty().isString(),
    body("bookRed").notEmpty().isString()
]