export interface MemberToken {
    header: MemberTokenHeader,
    payload: MemberTokenPayload
}

export interface MemberTokenHeader {
    alg: string
    typ: string
}

export interface MemberTokenPayload {
    mi: string
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

    /**
     * car plus member id
     */
    cpmi: string

    nickName?: string
}