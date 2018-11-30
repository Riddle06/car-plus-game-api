import { AppError } from '@view-models/common.vm';
import { RequestExtension, ResponseExtension } from "@view-models/extension";
import { NextFunction } from "express-serve-static-core";

export const exportEndMiddleware = async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {

    if (res.exportResult) {
        res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.end(res.exportResult)
    } else if (res.appError) {

        if (res.appError instanceof AppError) {
            res.json(res.appError.getResult());
        } else {
            res.json(AppError.getAppError(res.appError).getResult());
        }
        res.end();
    }

}