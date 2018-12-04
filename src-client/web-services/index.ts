import { AdminMemberWebSvc } from './admin.member.web.svc';
import { AdminGameWebSvc } from './admin.game.web.svc';
import { AdminExportWebSvc } from './admin.export.web.svc';
import { AdminAuthWebSvc } from './admin.auth.web.svc';
import { GameWebSvc } from './game.web.svc';
import { MemberWebSvc } from './member.web.svc';
import { MemberLoginWebSvc } from './member-login.web.svc';

export const memberLogin = new MemberLoginWebSvc();
export const member = new MemberWebSvc();
export const game = new GameWebSvc();

const adminAuth = new AdminAuthWebSvc();
const adminExport = new AdminExportWebSvc();
const adminGame = new AdminGameWebSvc();
const adminMember = new AdminMemberWebSvc();

export const adminSvc = {
    adminAuth,
    adminExport,
    adminGame,
    adminMember
}

export default {
    memberLogin,
    member,
    game
}

