const apiPath = window.location.protocol+'//'+window.location.hostname+":81/session"

export default class SessionService {
    static loginAnon() {
        return fetch(apiPath+'/login-anon', {
            method: "POST"
        })
            .then(res => res.status !== 500 && res.json())
    }

    static reConnect = (callback) => {};

    static onExpire(callback) {
        this.reConnect = callback;
    }

    static checkIfTokenExpired(session,request) {
        return new Promise(resolve =>
            request(session).then(res =>
                res.status === 401 ?
                    this.reConnect((session) =>
                        request(session).then(res => resolve({res,session}))
                    ) : resolve({res,session})
            )
        )
    }
}