import { Router } from "express";
import { RequestExtension, ResponseExtension } from "@view-models/extension";
import { AppError } from "@view-models/common.vm";
import { gameSvc } from "@services";

const router = Router();

// 使用此道具
router.put('/:id', async (req: RequestExtension, res: ResponseExtension, next) => {

    try {
        const { memberToken } = req
        const memberGameItemId: string = req.params.id
        res.result = await gameSvc.memberUseGameItem(memberToken, memberGameItemId)
    } catch (error) {
        res.appError = AppError.getAppError(error)
    }
    next();

})

// 取得目前會員遊戲道具資訊
router.get('/', async (req: RequestExtension, res: ResponseExtension, next) => {

    try {
        res.result = null;
        //TODO: 取得目前會員遊戲道具資訊
    } catch (error) {
        res.appError = AppError.getAppError(error)
    }
    next();
})

// 取得目前會員可使用的道具資訊
router.get('/usable', async (req: RequestExtension, res: ResponseExtension, next) => {

    try {
        const { memberToken } = req
        res.result = await gameSvc.memberGetUsableGameItems(memberToken)
    } catch (error) {
        res.appError = AppError.getAppError(error)
    }
    next();
})



export default router