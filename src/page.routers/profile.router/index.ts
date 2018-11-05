import { Router } from "express";

const router = Router();

router.get('/', async (req, res, next) => {

    res.render('pages/profile', {
        layout: 'layouts/index'
    });
    
})

export default router;