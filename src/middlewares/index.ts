import { RequestExtension, ResponseExtension } from "view-models/extension";
import { NextFunction, Response } from "express";
import { AppError, ResultCode } from "@view-models/common.vm";
import { verificationSvc } from "@services";

export const memberTokenVerificationMiddleware = async (req: RequestExtension, res: Response, next: NextFunction) => {
    next()
    return;
    try {
        const token = req.header('Authorization');
        const verificationRet = await verificationSvc.parseToken(req.path, token)

        if (verificationRet.success && verificationRet.item) {
            req.memberToken = verificationRet.item
        }
        next();
    } catch (error) {
        console.log(`memberTokenVerificationMiddleware error`)
        console.dir(error)
        if (error instanceof AppError) {
            res.json(error.getResult())
        } else {
            res.json(new AppError(error.toString(), ResultCode.serverError))
        }
        res.end();
    }
}



export const responseEndMiddleware = async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {
    try {

        if (res.result) {
            res.json(res.result)
        } else if (res.appError) {
            res.json(res.appError.getResult())
        }

    } catch (error) {

        if (error instanceof AppError) {
            res.json(error.getResult())
        } else {
            res.json(new AppError(error.toString(), ResultCode.serverError))
        }


    } finally {
        res.end();
    }
}
