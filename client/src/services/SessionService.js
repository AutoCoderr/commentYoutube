import request from "../request";

const apiPath = window.location.protocol+'//'+window.location.hostname+":3001/session"

export default class SessionService {
    static loginAnon() {
        return fetch(apiPath+'/login-anon', {
            method: "POST"
        })
            .then(res => res.status !== 500 && res.json())
    }

    static testLogin() {
        return request(apiPath+"/test")
    }

    static reConnect = (callback) => {};
}
