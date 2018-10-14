export interface MemberToken {
    header: MemberTokenHeader,
    payload: MemberTokenPayload
}

export interface MemberTokenHeader {

}

export interface MemberTokenPayload {
    mi: string
}