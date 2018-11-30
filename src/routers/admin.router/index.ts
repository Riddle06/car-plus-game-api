import { exportEndMiddleware } from './../../middlewares/export.middleware';
import { Router } from "express";
import AdminAuthRouter from "./admin.auth.router";
import AdminGameRouter from "./admin.game.router";
import AdminMemberRouter from "./admin.member.router";
import ExportRouter from "./export.router";

const router = Router();

router.use('/auth', AdminAuthRouter)
router.use('/member', AdminMemberRouter)
router.use('/game', AdminGameRouter)
router.use('/export', ExportRouter, exportEndMiddleware);

export default router;