import React,{createContext,useState,useEffect} from "react";
import useQuery from "../services/useQuery";
import SessionService from "../services/SessionService";

export const SessionContext = createContext(null);

export function SessionProvider({children}) {
    const [session,setSession] = useState(null);

    const query = useQuery();

    useEffect(() => {
        if (query.get('code')) {
            console.log('there is code');
        } else if (localStorage.getItem('session') ) {
            setSession(JSON.parse(localStorage.getItem('session')));
        } else {
            SessionService.loginAnon()
                .then(anonSession => setSession(anonSession) | localStorage.setItem('session',JSON.stringify(anonSession)))
                .catch(e => console.error(e));
        }

        SessionService.onExpire(callback => {
            SessionService.loginAnon()
                .then(anonSession => setSession(anonSession) | localStorage.setItem('session',JSON.stringify(anonSession)) | callback(anonSession.token))
                .catch(e => console.error(e));
        });
    }, []);


    return (
        <SessionContext.Provider value={session}>
            {children}
        </SessionContext.Provider>
    )
}