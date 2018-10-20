import { Result, BaseResult } from "view-models/common.vm";
import { MemberToken } from "@view-models/verification.vm";

class VerificationSvc {
    async getGameToken(): Promise<Result<string>> {
        return null;
    }

    async parseToken(path: string, token: string): Promise<Result<MemberToken>> {
        return null;
    }
}

export const verificationSvc = new VerificationSvc();