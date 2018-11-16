import { Router } from "express";
import AdminAuthRouter from "./admin.auth.router";
import AdminGameRouter from "./admin.game.router";
import AdminMemberRouter from "./admin.member.router";

const router = Router();

router.use('/auth', AdminAuthRouter)
router.use('/member', AdminMemberRouter)
router.use('/game', AdminGameRouter)

export default router;