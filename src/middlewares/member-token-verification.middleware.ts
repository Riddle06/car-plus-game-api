import { RequestExtension, ResponseExtension } from "@view-models/extension";
import { NextFunction } from "express";
import { verificationSvc } from "@services";
import { AppError, ResultCode } from "@view-models/common.vm";


export const memberTokenVerificationMiddleware = async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {

    try {

        const tokenWithBearer = req.header('Authorization') || "";

        const token = tokenWithBearer.replace('Bearer', '').trim();

        const verificationRet = await verificationSvc.verifyAndParseToken(req.path, token)

        if (verificationRet.success && verificationRet.item) {
            req.memberToken = verificationRet.item
        }
        next();
    } catch (error) {
        console.error(`memberTokenVerificationMiddleware error`, error)
        if (error instanceof AppError) {
            res.json(error.getResult())
        } else {
            res.json(new AppError(error.toString(), ResultCode.serverError))
        }
        res.end();
    }
}