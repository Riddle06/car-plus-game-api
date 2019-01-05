import axios, { AxiosInstance } from "axios";
import * as cookie from "js-cookie";
import { Notification } from 'element-ui';

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

        const adminToken = this.getAdminToken();
        this.axiosAdminInstance = axios.create({
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                clientId,
                Authorization: `Bearer ${adminToken}`
            }
        })

        this.axiosAdminInstance.interceptors.response.use(response => {
            const { data } = response;
            const { success, message } = data;

            if (!success) {
                Notification({
                    type: 'error',
                    title: '發生錯誤',
                    message: message
                });
            }

            return response
        })

        this.axiosInstance.interceptors.response.use(response => {
            const { success, code, message } = response.data;

            if(!success && code === 403 && response.config.url.indexOf('api/member')) {
                window['__fakeAlert']({
                    title: message,
                    text: '',
                    showConfirmButton: false,
                });
            }
            return response;
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

    private getAdminToken(): string {
        const token = cookie.get('admin');

        return token;
    }
}