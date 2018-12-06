import { AdminUserToken } from '@view-models/admin.auth.vm';
import { Request, Response } from "express";
import { MemberToken } from "./verification.vm";
import { AppError, BaseResult, ListQueryParameter } from "./common.vm";
import { ExportResult } from '@utilities/exporter';

export interface RequestExtension extends Request {
    query: {
        pageIndex: string,
        pageSize: string,
        dateStart: string,
        dateEnd: string,
        desc: string
        orderField: string,
        keyword: string
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
    listQuery?: ListQueryParameter
    memberToken: MemberToken
    adminUserToken: AdminUserToken
    _scale?: number
}

export interface ResponseExtension extends Response {
    result?: BaseResult
    appError?: AppError
    exportResult?: ExportResult
}