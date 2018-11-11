import { Router } from "express";
import { gameQuestionSvc } from "@services";

const router = Router();

router.get('/', async (req, res, next) => {
    const questionsRet = await gameQuestionSvc.getQuestions()
    res.render('pages/question', {
        layout: 'layouts/index',
        questions: questionsRet.items
    })
})

export default router;