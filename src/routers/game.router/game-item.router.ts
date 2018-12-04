import { gameSvc } from '@services';
import { Router } from "express";
import { RequestExtension, ResponseExtension } from "@view-models/extension";
import { AppError } from "@view-models/common.vm";

const router = Router();


/**
 * [GET] api/game/item
 * 取得所有遊戲道具資訊
 */
router.get('/', async (req: RequestExtension, res: ResponseExtension, next) => {

    try {
        const { memberToken } = req;
        res.result = await gameSvc.getGameItems(memberToken);
    } catch (error) {
        res.appError = AppError.getAppError(error)
    }
    next();
})

/**
 * [GET] api/game/item/:id
 * 取得單一道具資訊
 */
router.get('/:id', async (req: RequestExtension, res: ResponseExtension, next) => {

    try {
        res.result = null;
    } catch (error) {
        res.appError = AppError.getAppError(error)
    }
    next();
})


/**
 * [POST] /api/game/item
 * 購買道具，可以一次買多個
 */
router.post('/', async (req: RequestExtension, res: ResponseExtension, next) => {

    try {
        const { memberToken } = req
        const param = req.body
        res.result = await gameSvc.memberBuyGameItem(memberToken, param);

    } catch (error) {
        res.appError = AppError.getAppError(error)
    }
    next();
})



export default router;