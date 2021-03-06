import { RequestExtension, ResponseExtension } from "@view-models/extension";
import { checker, uniqueId } from "@utilities";
import { MemberToken } from "@view-models/verification.vm";
import { NextFunction } from "express";
import { AppError, ResultCode } from "@view-models/common.vm";
import { adminAuthSvc } from "@services/admin.auth.svc";

/**
 * 
 */
export const adminTokenVerificationMiddleware = async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {

    try {
        const ignorePathRegex = [/^\/export\/\S+/, /^\/auth\/login/]

        if (ignorePathRegex.some(regex => regex.test(req.path))) {
            next();
            return;
        }

        const tokenWithBearer = req.header('Authorization') || "";

        const token = tokenWithBearer.replace('Bearer', '').trim();

        const verificationRet = await adminAuthSvc.verifyAndParseToken(req.path, token)

        if (verificationRet.success && verificationRet.item) {
            req.adminUserToken = verificationRet.item
        }
        next();
        return;
    } catch (error) {
        console.error(`admin token verification error`, error)
        if (error instanceof AppError) {
            res.json(error.getResult())
        } else {
            res.json(AppError.getAppError(error).getResult())
        }
        res.end();
        return;
    }


}
