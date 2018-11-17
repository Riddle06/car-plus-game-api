import axios, { AxiosInstance } from "axios";
import * as cookie from "js-cookie";

export abstract class BaseWebSvc {

    protected axiosInstance: AxiosInstance = null
    protected axiosAdminInstance: AxiosInstance = null

    constructor() {
        const clientId = cookie.get('clientId');

        const token = this.getToken();

        // 
        this.axiosInstance = axios.create({
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                clientId,
                Authorization: `Bearer ${token}`
            }
        });

        this.axiosAdminInstance = axios.create({
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                clientId,
                Authorization: `Bearer ${token}`
            }
        })
    }

    private getToken(): string {
        const tokenR = cookie.get('r');
        const tokenE = cookie.get('e');
        const tokenX = cookie.get('x');

        const tokens: string[] = []

        if (tokenR) {
            tokens.push(tokenR)
        }

        if (tokenE) {
            tokens.push(tokenE)
        }

        if (tokenX) {
            tokens.push(tokenX)
        }

        const token = tokens.length === 3 ? tokens.join('.') : ''

        return token;
    }
}