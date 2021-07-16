const apiPath = window.location.protocol+'//'+window.location.hostname+":81/session"

export default class SessionService {
    static loginAnon() {
        console.log('loginAnon');
        return fetch(apiPath+'/login-anon', {
            method: "POST"
        })
            .then(res => res.status !== 500 && res.json())
    }
}