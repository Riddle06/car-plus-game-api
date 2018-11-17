
import * as nodeCrypto from "crypto";

class Encrypt {

    /**
    * SHA 256 hash
    * @param str 要 hash 的字串
    */
    public sha256Hash(str: string): string {
        return nodeCrypto.createHash('sha256').update(str).digest("hex");
    }
}

export const encrypt = new Encrypt();