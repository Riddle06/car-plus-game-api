import { GameWebSvc } from './game.web.svc';
import { MemberWebSvc } from './member.web.svc';
import { MemberLoginWebSvc } from './member-login.web.svc';

export const memberLogin = new MemberLoginWebSvc();
export const member = new MemberWebSvc();
export const game = new GameWebSvc();


export default {
    memberLogin,
    member,
    game
}