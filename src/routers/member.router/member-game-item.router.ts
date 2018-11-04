import { Router } from "express";
import { RequestExtension, ResponseExtension } from "@view-models/extension";
import { AppError } from "@view-models/common.vm";

const router = Router();

// 使用此道具
router.put('/:id', async (req: RequestExtension, res: ResponseExtension, next) => {
    const memberGameItemId = req.params.id;

})

// 取得目前會員遊戲道具資訊
router.get('/', async (req: RequestExtension, res: ResponseExtension, next) => {

    try {
        res.result = null;
    } catch (error) {
        res.appError = AppError.getAppError(error)
    }
    next();
})



export default router