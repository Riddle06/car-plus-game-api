export enum ResultCode {
    success = 200,
    clientError = 403,
    resourceNotFound = 404,
    serverError = 500
}

export class BaseResult {
    success: boolean
    code: ResultCode
    message: string
    exception?: string

    constructor(success: boolean, code?: ResultCode, message?: string, exception?: string) {
        this.success = success;
        if (!code) {
            this.code = this.success ? ResultCode.success : ResultCode.clientError
        } else {
            this.code = code;
        }
        this.message = message || "";
        this.exception = exception
    }
}

export class Result<T> extends BaseResult {
    item: T
}

export class ListResult<T> extends BaseResult {
    items: T[]
}


export class AppError extends Error {
    private code: ResultCode = null
    constructor(message: string, code?: ResultCode) {
        super(message)
        this.code = code || ResultCode.clientError
    }
    public getResult(): BaseResult {
        return {
            success: false,
            code: this.code,
            message: this.message
        };
    }
}