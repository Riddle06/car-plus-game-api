export type QueryCountDbModel = {
    count: number
}[]

export interface PageInfo {
    pageIndex: number
    pageSize: number
    dateStart?: Date | string
    dateEnd?: Date | string
}

export enum ResultCode {
    success = 200,
    clientError = 403,
    resourceNotFound = 404,
    serverError = 500,
    accessTokenExpired = 1,
}

export class BaseResult {
    success: boolean
    code: ResultCode
    message: string
    exception?: string

    constructor(success?: boolean, code?: ResultCode, message?: string, exception?: string) {
        if (!success) {
            success = false
        }
        this.setResultValue(success, code, message, exception);
    }

    setResultValue(success: boolean, code?: ResultCode, message?: string, exception?: string): this {
        this.success = success;
        if (!code) {
            this.code = this.success ? ResultCode.success : ResultCode.clientError
        } else {
            this.code = code;
        }
        this.message = message || "";
        this.exception = exception;
        return this;
    }
}

export class Result<T> extends BaseResult {
    item: T
}

export class ListResult<T> extends BaseResult {
    items: T[]

    page?: {
        dataAmount: number
        pageAmount: number
    }
}


export class AppError extends Error {
    private code: ResultCode = null
    constructor(message: string, code?: ResultCode) {
        super(message)
        this.code = code || ResultCode.clientError
    }
    public getResult(): BaseResult {
        const ret = new BaseResult(false, this.code, this.message)
        return ret;
    }

    static getAppError(err: unknown): AppError {
        console.dir(err);
        if (err instanceof AppError) {
            return err
        } else if (err instanceof Error) {
            return new AppError(err.message, ResultCode.serverError)
        } else {
            console.log(`error handler un catch exception`, err)
            return new AppError('server error', ResultCode.serverError)
        }
    }
}


export class PageQuery<T = any> {
    listQueryParam: Partial<ListQueryParameter>
    params: T
    constructor(listQueryParam: Partial<ListQueryParameter>, params: T = null) {

        this.params = params
        this.listQueryParam = listQueryParam;
    }
}

export interface ListQueryParameter {
    pageIndex: number
    pageSize: number
    dateStart: Date
    dateEnd: Date
    desc: boolean
    orderField: string
}
