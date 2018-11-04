import { Router } from "express";
import { RequestExtension, ResponseExtension } from "@view-models/extension";
import { AppError } from "@view-models/common.vm";

const router = Router();

router.get('/', async (req: RequestExtension, res: ResponseExtension, next) => {


    try {

    } catch (error) {
        if (error instanceof AppError) {
            error.getResult()
        }

    }

    next();
})


export default router;