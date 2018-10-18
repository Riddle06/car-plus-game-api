import { Router } from "express";
import { RequestExtension } from "view-models/extension";

const router = Router();

router.get('/test', async (req: RequestExtension, res, next) => {

})


export default router;