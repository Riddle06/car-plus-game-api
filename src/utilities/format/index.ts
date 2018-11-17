
import * as luxon from "luxon";
import { checker } from "../type-checker";

class Format {

    /**
     * 
     * @param mobile 
     * @param countryCode 國際代碼（台灣：+886)
     */

    nationalMobile(mobile: string, countryCode: string): string {

        return `${countryCode}${mobile.substring(1)}`
    }


    padLeft(str: string, lenght: number, padLeftStr?: string): string {

        if (!padLeftStr) {
            padLeftStr = "0";
        }
        if (str.length >= lenght)
            return str;
        else
            return this.padLeft(padLeftStr + str, lenght, padLeftStr);
    }


    tryToParseFloat(x: string, defaultValue?: number): number {

        if (defaultValue === undefined) {
            defaultValue = null;
        }

        let ret: number = undefined

        try {
            ret = parseFloat(x)
        } catch (error) {
            ret = defaultValue;
        }

        if (isNaN(ret)) {
            ret = defaultValue;
        }

        return ret;
    }

    tryParseToDate(d: string, defaultValue: Date): Date {

        if (checker.isNullOrUndefinedOrWhiteSpace(d)) {
            return defaultValue;
        }

        const m = luxon.DateTime.fromFormat(d, 'YYYY-MM-DD HH:mm:ss')
        if (m.isValid) {
            return m.toJSDate();
        } else {
            return defaultValue
        }
    }



    queryStringNumberHandler(value: string | string[]): number | number[] {
        if (Array.isArray(value)) {
            const ret: number[] = [];
            for (const v of value) {

                if (isNaN(Number(v))) {
                    continue;
                }

                ret.push(Number(v))
            }
            return ret;
        } else {
            if (isNaN(Number(value))) {
                return null
            }
            return Number(value)
        }
    }
    maskMobile(mobile: string): string {
        return `${mobile.substr(0, 2)}${mobile.substr(2, mobile.length - 4).split('').map(x => `*`).join('')}${mobile.substr(mobile.length - 3, 3)}`
    }

    filterEmoji(str: string, replaceStr: string = ""): string {
        return str.replace(/([\uD800-\uDBFF][\uDC00-\uDFFF])/g, '')
    }



}

export const formatter = new Format()
