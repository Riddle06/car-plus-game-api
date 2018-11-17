import { adminAuthSvc } from '@services/admin.auth.svc';
import { Router } from "express";
import { RequestExtension, ResponseExtension } from "@view-models/extension";

const router = Router();

// 取得該登入帳號資訊
router.get('/', async (req: RequestExtension, res: ResponseExtension, next) => {

    try {
        const ret = await adminAuthSvc.getProfile(req.adminUserToken)
        res.result = ret;
    } catch (error) {
        res.appError = error
    }

    next();
})

// 登入
router.post('/login', async (req: RequestExtension, res: ResponseExtension, next) => {

    try {
        const { clientId } = req.headers
        const ret = await adminAuthSvc.login(clientId as string, req.body)
        res.result = ret;
    } catch (error) {
        res.appError = error
    }

    next();
})


// 登出
router.put('/logout', async (req: RequestExtension, res: ResponseExtension, next) => {

    try {
        const ret = await adminAuthSvc.logout()
        res.result = ret;
    } catch (error) {
        res.appError = error
    }


    next();
})

export default router;