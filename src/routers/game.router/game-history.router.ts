import { Router } from "express";
import { RequestExtension, ResponseExtension } from "view-models/extension";
import { AppError } from "@view-models/common.vm";

const router = Router();

router.get('/', async (req: RequestExtension, res: ResponseExtension, next) => {

    try {
        res.result = null;
    } catch (error) {
        res.appError = AppError.getAppError(error)
    }
    next();
})

router.get('/:id', async (req: RequestExtension, res: ResponseExtension, next) => {

    try {
        res.result = null;
    } catch (error) {
        res.appError = AppError.getAppError(error)
    }
    next();
})



// 開始遊戲
router.post('/', async (req: RequestExtension, res: ResponseExtension, next) => {

    try {
        res.result = null;
        const param = req.body;
    } catch (error) {
        res.appError = AppError.getAppError(error)
    }
    next();
})

// 回報遊戲
router.put('/:id', async (req: RequestExtension, res: ResponseExtension, next) => {

    try {
        res.result = null;
    } catch (error) {
        res.appError = AppError.getAppError(error)
    }
    next();
})



export default router;