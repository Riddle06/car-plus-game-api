import { Router } from "express";
import { RequestExtension, ResponseExtension } from "@view-models/extension";

const router = Router();

router.post('/', async (req: RequestExtension, res: ResponseExtension, next) => {

    const param: { carPlusMemberId: string, clientId: string } = req.body


})


export default router