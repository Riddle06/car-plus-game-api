import { Request, Response } from "express";
import { MemberToken } from "./verification.vm";
import { AppError, BaseResult } from "./common.vm";

export interface RequestExtension extends Request {
    query: {
        page: number,
        size: number,
        keyword: string | string[]
        mi: string
        [key: string]: string | number | Array<string | number>
    }

    cookies: {
        clientId?: string
        r?: string
        e?: string
        x?: string
        [key: string]: any
    }

    memberToken: MemberToken
}

export interface ResponseExtension extends Response {
    result?: BaseResult
    appError?: AppError
}