import * as uuid from 'uuid'
import * as shortid from "shortid";

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

    generateShortId(): string {
        return shortid.generate();
    }

}

export const uniqueId = UniqueId.getInstance();



