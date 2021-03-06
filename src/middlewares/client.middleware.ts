import { RequestExtension, ResponseExtension } from "@view-models/extension";
import { checker, uniqueId } from "@utilities";
import * as luxon from 'luxon'
import * as jwt from "jsonwebtoken";
import { MemberToken } from "@view-models/verification.vm";
import { memberSvc } from "@services";
import { NextFunction } from "express";
import { configurations } from "@configuration";

/**
 * 如果沒有 client id client side 會自動生成 client id
 */
export const clientMiddleware = async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {

    const ignorePaths = ['no-token', '/admin/api', '/api', '/administration'];

    if (ignorePaths.some(ignorePath => req.path.indexOf(ignorePath) > -1)) {
        next();
        return;
    }

    // 裝置
    let clientId = req.cookies.clientId;

    if (checker.isNullOrUndefinedOrWhiteSpace(clientId)) {
        clientId = uniqueId.generateV4UUID()
        res.cookie('clientId', clientId, {
            httpOnly: false,
            expires: luxon.DateTime.local().plus({ years: 200 }).toJSDate(),
        })
    }
    const token = getToken(req)
    // 沒有 query string 的情況下會用 token 
    if (checker.isNullOrUndefinedOrWhiteSpace(req.query.mi)) {
        if (checker.isNullOrUndefinedOrWhiteSpace(token)) {
            res.redirect(configurations.officialHost)
            return;
        }
    } else {
        if (checker.isNullOrUndefinedOrWhiteSpace(token)) {
            const success = await getMemberLoginToken(clientId, req, res)
            if (!success) {
                res.redirect(configurations.officialHost); return;
            }
        } else {
            const tokenVM = jwt.decode(token, { complete: true }) as MemberToken
            // 如果 query string 跟 cookie 記得不一樣就會幫他註冊一筆
            if (tokenVM.payload.mi !== req.query.mi) {
                const success = await getMemberLoginToken(clientId, req, res)
                if (!success) { res.redirect(configurations.officialHost); return; }
            }
        }
    }


    next();
}


export const adminClientMiddleware = async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {

    console.log(req.originalUrl)
    if (req.originalUrl.indexOf('/administration/login') > -1) {
        next();
        return;
    }

    const token = req.cookies.admin;
    if (checker.isNullOrUndefinedOrWhiteSpace(token)) {
        res.redirect('/administration/login'); return;
    }

    next();
}


function getToken(req: RequestExtension): string {

    const tokens: string[] = [];
    if (req.cookies.r) {
        tokens.push(req.cookies.r)
    }

    if (req.cookies.e) {
        tokens.push(req.cookies.e)
    }

    if (req.cookies.x) {
        tokens.push(req.cookies.x)
    }

    if (tokens.length === 3) {
        return tokens.join('.')
    }

    return "";
}

async function getMemberLoginToken(clientId: string, req: RequestExtension, res: ResponseExtension): Promise<boolean> {
    // 清空cookie
    res.clearCookie('r');
    res.clearCookie('e');
    res.clearCookie('x');

    try {
        const memberLoginRet = await memberSvc.createMemberLogin({ clientId, carPlusMemberId: req.query.mi });
        if (memberLoginRet.success && !checker.isNullOrUndefinedOrWhiteSpace(memberLoginRet.item)) {
            const token = memberLoginRet.item;
            const tokens = token.split('.');
            const tokenVM = jwt.decode(token, { complete: true }) as MemberToken
            const expires = luxon.DateTime.fromMillis(tokenVM.payload.exp).toJSDate();

            res.cookie('r', tokens[0], { httpOnly: false, expires });
            res.cookie('e', tokens[1], { httpOnly: false, expires });
            res.cookie('x', tokens[2], { httpOnly: false, expires });
        }

        return true
    } catch (error) {
        console.dir(`getMemberLoginToken error`, error)
        return false
    }



}

