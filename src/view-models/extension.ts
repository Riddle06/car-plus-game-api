import { Request, Response } from "express";
import { MemberToken } from "./verification.vm";
import { AppError, BaseResult } from "./common.vm";

export interface RequestExtension extends Request {
    query: {
        page: number,
        size: number,
        keyword: string | string[]
        [key: string]: string | number | Array<string | number>
    }

    memberToken: MemberToken
}

export interface ResponseExtension extends Response {
    result?: BaseResult
    appError?: AppError
}