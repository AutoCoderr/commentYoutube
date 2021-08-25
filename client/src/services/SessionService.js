import request from "../request";
import RequestService from "./RequestService";

const apiPath = window.location.protocol+'//'+window.location.hostname+":3001/session"

export default class SessionService {
    static login(code) {
        return fetch(apiPath+'/login', {
            method: "POST",
            ...(code !== null ? {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                body: RequestService.formatUrlEncoded({code})
            } : {})
        })
            .then(res => res.status !== 500 && res.json())
    }

    static testLogin() {
        return request(apiPath+"/test")
    }

    static getClientId() {
        return fetch(apiPath+"/client_id").then(res => res.json())
    }

    static reConnect = (callback) => {};
}
