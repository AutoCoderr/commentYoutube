import SessionService from "./services/SessionService";

export default function request(url,options = {}) {
    return new Promise(resolve => {
        const session = JSON.parse(localStorage.getItem("session"));
        if (session) {
            options.headers = {
                ...(options.headers || {}),
                'Authorization': "Bearer " + session.token
            }
        }
        fetch(url,options)
            .then(res =>
                res.status === 401 ?
                    SessionService.reConnect(session => fetch(url,{
                            ...options,
                            headers: {
                                ...(options.headers || {}),
                                'Authorization': "Bearer " + session.token
                            }
                        }).then(res => resolve({res,session}))
                    ) : resolve({res, session})
            )
    });
}