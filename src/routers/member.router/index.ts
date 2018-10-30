import { Router } from "express";
import { RequestExtension, ResponseExtension } from "@view-models/extension";
import { AppError } from "@view-models/common.vm";
import { memberSvc } from "@services";
import MemberLoginRouter from "./member-login.router";
import MemberGameItemRouter from "./member-game-item.router";

const router = Router();

router.use('/login', MemberLoginRouter)
router.use('/game-item', MemberGameItemRouter);

// 取得會員資料
router.get('/', async (req: RequestExtension, res: ResponseExtension, next) => {

    try {
        const { memberToken } = req;
        res.result = null;
    } catch (error) {
        res.appError = AppError.getAppError(error)
    }
    next();
});

// 修改暱稱
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

// 取得目前會員遊戲道具資訊
router.get('/game-item', async (req: RequestExtension, res: ResponseExtension, next) => {

    try {
        res.result = null;
    } catch (error) {
        res.appError = AppError.getAppError(error)
    }
    next();
})

// 會員開始使用道具（可以多個）
router.post('/game-item', async (req: RequestExtension, res: ResponseExtension, next) => {

    try {
        res.result = null;
    } catch (error) {
        res.appError = AppError.getAppError(error)
    }
    next();
})


export default router;