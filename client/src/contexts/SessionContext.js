import React,{createContext,useState,useEffect, useCallback} from "react";
import useQuery from "../useQuery";
import SessionService from "../services/SessionService";

export const SessionContext = createContext(null);

export function SessionProvider({children}) {
    const [session,setSession] = useState(null);

    const query = useQuery();

    const connect = useCallback(
        () => SessionService.loginAnon()
                .then(session => {
                    setSession(session);
                    localStorage.setItem('session',JSON.stringify(session))
                    return session;
                })
                .catch(e => console.error(e))
        , [])

    useEffect(() => {
        let curSession;
        if (query.get('code')) {
            console.log('there is code');
        } else if ((curSession = localStorage.getItem('session'))) {
            curSession = JSON.parse(curSession);
            SessionService.testLogin()
                .then(({session}) => session.token === curSession.token && setSession(session));
        } else {
            connect();
        }

        SessionService.reConnect = callback => connect().then(session => callback(session));

    }, []);


    return (
        <SessionContext.Provider value={session}>
            {children}
        </SessionContext.Provider>
    )
}