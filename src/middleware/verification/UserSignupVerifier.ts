import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import User from "../../models/User";

const UserSignupVerifier = async (req: Request,res: Response,next: NextFunction) => {
    const check = validationResult(req);
    if(check.isEmpty()){
        const duplicateUser = await User.findOne({ email: req.body.email });
        if(!duplicateUser){
            next();
        }
        else{
            res.status(409).send("User Already Registered!");
        }
    }
    else{
        res.status(404).send("Invalid User Input")
    }
}

export default UserSignupVerifier;