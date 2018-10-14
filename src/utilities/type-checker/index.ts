import * as luxon from "luxon";
class TypeChecker {
    isGender(g: number): boolean {
        return [0, 1, 2].some(x => x === g);
    }

    isDate(d: Date): d is Date {
        return luxon.DateTime.fromJSDate(d).isValid
    }
    isNullOrUndefinedOrWhiteSpace(value: string): boolean {

        if (value === null) {
            return true;
        }

        if (value === undefined) {
            return true;
        }

        if (value.replace(/\s/g, '') === '') {
            return true;
        }

        return false;
    }


    /**
     * 是否為大於 0 的整數
     */
    isNaturalInteger(num: number): boolean {
        const regex = /^\+?[1-9][0-9]*$/;

        return regex.test(num.toString());
    }

    isNullOrUndefinedObject(obj: any): boolean {
        return obj === undefined || obj === null;
    }

    isEmail(str: string): boolean {
        let mailRegExp: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return mailRegExp.test(str);
    }

    isMobile(str: string): boolean {
        const mobileRegex = /^(0)(9)([0-9]{8})$/;
        return mobileRegex.test(str);
    }

    isNumber(str: string | number): boolean {
        const a = Number(str)
        return !isNaN(a);
    }

    isLegalPassword(str: string): boolean {
        const regex = /^(?=.*\d)(?=.*[a-zA-Z]).{8,30}$/g

        return regex.test(str)
    }

    isEmptyMobile(str: string): boolean {
        const emptyMobileRegex = /^\S+-mobile$/

        return this.isNullOrUndefinedOrWhiteSpace(str) || emptyMobileRegex.test(str);
    }

    isEmptyEmail(str: string): boolean {
        const emptyEmailRegex = /^\S+-tempmail@myre.life$/
        return this.isNullOrUndefinedOrWhiteSpace(str) || emptyEmailRegex.test(str);
    }

    isPosition(position: {
        lat: number,
        lng: number
    }): boolean {
        return !this.isNullOrUndefinedObject(position) && (position.lat !== 0 || position.lng !== 0) && (!this.isNullOrUndefinedObject(position.lat) && !this.isNullOrUndefinedObject(position.lng))
    }

}

export const checker = new TypeChecker();

