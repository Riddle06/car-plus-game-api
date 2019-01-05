import * as uuid from 'uuid'
import * as shortid from "shortid";
import * as validate from "uuid-validate";
import * as moment from "moment";
import { formatter } from "../format";

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

    getRandomCode(index: number): string {
        index = index % 1000
        const sort: string = formatter.padLeft(index.toString(), 4, "0");
        const decimalStr = `${sort}${moment().format("YYMMDDHHmmss")}}`;
        const base = ["T", "V", "F", "4", "M", "6", "S", "8", "G", "N", "Y", "J", "L", "9", "2", "5", "P", "7", "R", "U", "C", "X", "B", "D", "A", "E", "Z", "K", "Q", "W", "3", "H"]
        const num = parseInt(decimalStr);
        let currentQuotient = num;
        let remainders: number[] = [];

        do {
            remainders.push(currentQuotient % base.length)
            currentQuotient = Math.floor(currentQuotient / base.length);
        } while (currentQuotient > base.length);
        remainders.push(currentQuotient);
        const numberArr = remainders.reverse();
        const newBaseArr: string[] = [];

        for (const num of numberArr) {
            newBaseArr.push(base[num])
        }
        return newBaseArr.join('');
    }

}

export const uniqueId = UniqueId.getInstance();



