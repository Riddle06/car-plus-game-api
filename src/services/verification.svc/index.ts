import { Result, BaseResult } from "view-models/common.vm";

class VerificationSvc {
    async getGameToken(): Promise<Result<string>> {
        return null;
    }

    async verifyToken(token: string): Promise<BaseResult> {
        return null;
    }
}

export const verificationSvc = new VerificationSvc();