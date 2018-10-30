import { checker, uniqueId } from '@utilities';
import { RequestExtension, ResponseExtension } from "view-models/extension";
import { NextFunction, Response } from "express";
import { AppError, ResultCode } from "@view-models/common.vm";
import { verificationSvc } from "@services";
import * as luxon from "luxon";

export const memberTokenVerificationMiddleware = async (req: RequestExtension, res: Response, next: NextFunction) => {
    next()
    return;
    try {
        const token = req.header('Authorization');
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



export const clientMiddleware = async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {

    if (checker.isNullOrUndefinedOrWhiteSpace(req.cookies.clientId)) {
        res.cookie('clientId', uniqueId.generateV4UUID(), {
            httpOnly: true,
            expires: luxon.DateTime.local().plus({ years: 200 }).toJSDate(),
        })
    }

    next();
}