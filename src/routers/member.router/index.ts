import { variableSvc } from '@services/variable.svc';
import { Router } from "express";
import { RequestExtension, ResponseExtension } from "@view-models/extension";
import { AppError } from "@view-models/common.vm";
import { memberSvc } from "@services";
import MemberLoginRouter from "./member-login.router";
import MemberGameItemRouter from "./member-game-item.router";

const router = Router();

router.use('/login', MemberLoginRouter)
router.use('/game-item', MemberGameItemRouter);


/**
 * [GET] /api/member
 * 取得會員資料
 */
router.get('/', async (req: RequestExtension, res: ResponseExtension, next) => {

    try {
        const { memberToken } = req;
        res.result = await memberSvc.getMemberInformation(memberToken)
    } catch (error) {
        res.appError = AppError.getAppError(error)
    }
    next();
});


/**
 * [PUT] /api/member/nick-name
 * 修改暱稱
 */
router.put('/nick-name', async (req: RequestExtension, res: ResponseExtension, next) => {

    try {
        const param = req.body;
        const { memberToken } = req
        const ret = await memberSvc.updateMemberNickName(memberToken, param);
        res.result = ret;
    } catch (error) {
        res.appError = AppError.getAppError(error)
    }
    next();
})


/**
 * [GET] /api/member/level-info
 * 等級參數
 */
router.get('/level-info', async (req: RequestExtension, res: ResponseExtension, next) => {

    try {
        res.result = await variableSvc.getLevelInformation()
    } catch (error) {
        res.appError = AppError.getAppError(error)
    }
    next();
})



export default router;