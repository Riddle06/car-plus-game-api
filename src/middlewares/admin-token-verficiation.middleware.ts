import { RequestExtension, ResponseExtension } from "@view-models/extension";
import { checker, uniqueId } from "@utilities";
import * as luxon from 'luxon'
import * as jwt from "jsonwebtoken";
import { MemberToken } from "@view-models/verification.vm";
import { memberSvc } from "@services";
import { NextFunction } from "express";
import { AppError, ResultCode } from "@view-models/common.vm";
import { adminAuthSvc } from "@services/admin.auth.svc";

/**
 * 
 */
export const adminTokenVerificationMiddleware = async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {

    try {
        const tokenWithBearer = req.header('Authorization');

        const token = tokenWithBearer.replace('Bearer', '').trim();

        const verificationRet = await adminAuthSvc.verifyAndParseToken(req.path, token)

        if (verificationRet.success && verificationRet.item) {
            req.adminUserToken = verificationRet.item
        }
        next();
    } catch (error) {
        console.error(`admin token verification error`, error)
        if (error instanceof AppError) {
            res.json(error.getResult())
        } else {
            res.json(new AppError(error.toString(), ResultCode.serverError))
        }
        res.end();
    }

    next();
}
