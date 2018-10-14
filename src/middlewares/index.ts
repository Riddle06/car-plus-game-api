import { RequestExtension } from "view-models/extension";
import { NextFunction, Response } from "express";

export const memberTokenVerificationMiddleware = async (req: RequestExtension, res: Response, next: NextFunction) => {

    try {
        req.memberToken = null
        next();
    } catch (error) {
        res.json()
        res.end();
    }
}

