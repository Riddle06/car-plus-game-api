import { Router } from "express";
import { RequestExtension, ResponseExtension } from "@view-models/extension";
import { AppError } from "@view-models/common.vm";
import { gameSvc } from "@services";

const router = Router();


/**
 * [PUT] /api/member/game-item/:id
 * 使用此道具
 * @param {String} id 此識別值為 `memberGameItemIds` 欄位中的 id
 */
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


/**
 * [GET] /api/member/game-item
 * 取得目前會員擁有的遊戲道具資訊（包含角色跟道具）
 */
router.get('/', async (req: RequestExtension, res: ResponseExtension, next) => {

    try {
        res.result = await gameSvc.getMemberItems(req.memberToken);
    } catch (error) {
        res.appError = AppError.getAppError(error)
    }
    next();
})


/**
 * [GET] /api/member/game-item/usable
 * 取得目前會員可使用的道具資訊
 */
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