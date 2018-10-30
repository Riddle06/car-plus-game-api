import { Router } from "express";
import { RequestExtension, ResponseExtension } from "@view-models/extension";
import { MemberLoginCreateParameterVM } from '@view-models/member.vm';
import { memberSvc } from '../../services/member.svc/index';
import { AppError } from "@view-models/common.vm";

const router = Router();

router.post('/', async (req: RequestExtension, res: ResponseExtension, next) => {
    const param: MemberLoginCreateParameterVM = req.body;
    try {
        res.result = await memberSvc.createMemberLogin(param)
    } catch (error) {
        res.appError = AppError.getAppError(error)
    }
    next();
})


export default router