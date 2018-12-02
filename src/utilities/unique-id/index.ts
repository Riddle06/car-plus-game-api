import * as uuid from 'uuid'
import * as shortid from "shortid";
import * as validate from "uuid-validate";

class UniqueId {

    private static instance: UniqueId = null;
    static getInstance(): UniqueId {
        if (UniqueId.instance === null) {
            UniqueId.instance = new UniqueId();
        }
        return UniqueId.instance;
    }

    private constructor() { }

    generateV4UUID(): string {
        return uuid.v4();
    }

    isUUID(id: string): boolean {
        return validate(id);
    }

    generateShortId(): string {
        return shortid.generate();
    }

}

export const uniqueId = UniqueId.getInstance();



