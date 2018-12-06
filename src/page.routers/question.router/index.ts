import { Router } from "express";
import { gameQuestionSvc } from "@services";
import { RequestExtension, ResponseExtension } from "@view-models/extension";


const router = Router();

router.get('/', async (req: RequestExtension, res: ResponseExtension, next) => {
    const questionsRet = await gameQuestionSvc.getQuestions()
    res.render('pages/question', {
        questions: questionsRet.items,
        scale: req._scale,
    })
})

export default router;