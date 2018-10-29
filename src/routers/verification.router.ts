import { Router } from "express";
import { RequestExtension, ResponseExtension } from "view-models/extension";
import { AppError } from "@view-models/common.vm";

const router = Router();

// router.get('/token', async (req: RequestExtension, res: ResponseExtension, next) => {

//     try {
//         const param: {
//             carPlusMemberId: string,
//             clientId: string
//         } = {
//             carPlusMemberId: req.query['']
//         }
//         res.result = null;
//     } catch (error) {
//         res.appError = AppError.getAppError(error)
//     }
//     next();
// });



export default router;