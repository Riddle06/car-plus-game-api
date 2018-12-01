import { adminAuthSvc } from '@services/admin.auth.svc';
import { AppError } from '@view-models/common.vm';
import { RequestExtension, ResponseExtension } from "@view-models/extension";
import { NextFunction } from "express-serve-static-core";
export const exportStartMiddleware = async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {

    const adminToken = req.query.token as string;

    try {
        const ret = await adminAuthSvc.verifyAndParseToken(req.path, adminToken);
        req.adminUserToken = ret.item
        next();
    } catch (error) {

        if (res.appError instanceof AppError) {
            res.json(res.appError.getResult());
        } else {
            res.json(AppError.getAppError(res.appError).getResult());
        }
        res.end();
        return;
    }
}
export const exportEndMiddleware = async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {

    if (res.exportResult) {
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader("Content-Disposition", `attachment; filename= ${encodeURIComponent(res.exportResult.fileName)}.xlsx`);
        res.end(res.exportResult.buffer)
    } else if (res.appError) {
        console.dir(res.appError)
        if (res.appError instanceof AppError) {
            res.json(res.appError.getResult());
        } else {
            res.json(AppError.getAppError(res.appError).getResult());
        }
        res.end();
    }

}