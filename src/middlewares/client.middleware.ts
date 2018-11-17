import { RequestExtension, ResponseExtension } from "@view-models/extension";
import { checker, uniqueId } from "@utilities";
import * as luxon from 'luxon'
import * as jwt from "jsonwebtoken";
import { MemberToken } from "@view-models/verification.vm";
import { memberSvc } from "@services";
import { NextFunction } from "express";

/**
 * 如果沒有 client id client side 會自動生成 client id
 */
export const clientMiddleware = async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {
    
    if (req.path.indexOf('no-token') > -1) {
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
    // Token
    const token = getToken(req)
    if (checker.isNullOrUndefinedOrWhiteSpace(req.query.mi)) {
        if (checker.isNullOrUndefinedOrWhiteSpace(token)) {
            res.redirect('/no-token')
            return;
        }
    } else {
        if (checker.isNullOrUndefinedOrWhiteSpace(token)) {
            await getMemberLoginToken(clientId, req, res)
        } else {
            const tokenVM = jwt.decode(token, { complete: true }) as MemberToken
            if (tokenVM.payload.mi !== req.query.mi) {
                await getMemberLoginToken(clientId, req, res)
            }
        }
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

async function getMemberLoginToken(clientId: string, req: RequestExtension, res: ResponseExtension): Promise<void> {
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
    } catch (error) {
        res.redirect('/no-token')
    }



}

