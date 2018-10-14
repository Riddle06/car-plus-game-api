import { Request } from "express";
import { MemberToken } from "./verification.vm";

export interface RequestExtension extends Request {
    query: {
        page: number,
        size: number,
        keyword: string | string[]
        [key: string]: string | number | Array<string | number>
    }

    memberToken: MemberToken
}