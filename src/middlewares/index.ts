import { listQueryHandlerMiddleware } from './list-query-handler.middleware';
import { adminTokenVerificationMiddleware } from './admin-token-verficiation.middleware';
import { clientMiddleware } from './client.middleware';
import { RequestExtension, ResponseExtension } from "@view-models/extension";
import { NextFunction, Response } from "express";
import { AppError, ResultCode } from "@view-models/common.vm";
import { MemberToken } from '@view-models/verification.vm';
import { devMiddlewares } from "./webpack.dev.middleware";
import { memberTokenVerificationMiddleware } from './member-token-verification.middleware';


export { memberTokenVerificationMiddleware };

export { adminTokenVerificationMiddleware }

export { devMiddlewares };

export { clientMiddleware };

export { listQueryHandlerMiddleware };


export const responseEndMiddleware = async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {
    try {

        if (res.result) {

            res.json(res.result)
        } else if (res.appError) {
            res.json(res.appError.getResult())
        } else { 
            res.json((new AppError(`path: ${req.path} error`, ResultCode.clientError)).getResult())
        }

    } catch (error) {
        console.log(`responseEndMiddleware error`, error)
        if (error instanceof AppError) {
            res.json(error.getResult())
        } else {
            res.json(new AppError(error.toString(), ResultCode.serverError))
        }


    } finally {
        res.end();
    }
}


