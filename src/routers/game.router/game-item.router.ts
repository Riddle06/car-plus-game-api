import { gameSvc } from '@services';
import { Router } from "express";
import { RequestExtension, ResponseExtension } from "view-models/extension";
import { AppError } from "@view-models/common.vm";

const router = Router();


// 取得遊戲道具資訊
router.get('/', async (req: RequestExtension, res: ResponseExtension, next) => {

    try {
        const { memberToken } = req;
        res.result = await gameSvc.getGameItems(memberToken);
    } catch (error) {
        res.appError = AppError.getAppError(error)
    }
    next();
})

// 取得單一道具資訊
router.get('/:id', async (req: RequestExtension, res: ResponseExtension, next) => {

    try {
        res.result = null;
    } catch (error) {
        res.appError = AppError.getAppError(error)
    }
    next();
})

// 購買道具（多個）
router.post('/', async (req: RequestExtension, res: ResponseExtension, next) => {

    try {
        res.result = null;
    } catch (error) {
        res.appError = AppError.getAppError(error)
    }
    next();
})



export default router;