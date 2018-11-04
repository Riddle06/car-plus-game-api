import { GameWebSvc } from './game.web.svc';
import { MemberWebSvc } from './member.web.svc';
import { MemberLoginWebSvc } from './member-login.web.svc';

const memberLogin = new MemberLoginWebSvc();
const member = new MemberWebSvc();
const game = new GameWebSvc();

export {
    memberLogin,
    member,
    game
}