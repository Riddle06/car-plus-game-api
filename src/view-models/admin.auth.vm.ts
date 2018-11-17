export interface AdminUserVM {
    id: string
    name: string
    dateCreated: Date
    account: string
}

export interface AdminUserLoginParameterVM {
    account: string
    password: string
}


export interface AdminUserToken {
    header: AdminUserTokenHeader,
    payload: AdminUserTokenPayload
}

export interface AdminUserTokenHeader {
    alg: string
    typ: string
}

export interface AdminUserTokenPayload {

    /**
     * admin user id
     */
    id: string
    /**
     * 發行者
     */
    iss: string

    /**
     * token 有效期間 timestamp 格式
     */
    exp: number

    /**
     * 當下時間
     */
    iat: number

    /**
     * ci : client id
     */
    ci: string
}