import * as uuid from 'uuid'

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

}

export const uniqueId = UniqueId.getInstance();



