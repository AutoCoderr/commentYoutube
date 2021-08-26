import React,{createContext,useState,useEffect, useCallback} from "react";
import useQuery from "../useQuery";
import {useHistory} from "react-router-dom";
import SessionService from "../services/SessionService";

export const SessionContext = createContext(null);

export function SessionProvider({children}) {
    const [session,setSession] = useState(null);
    const [clientId,setClientId] = useState(null);

    const query = useQuery();
    const history = useHistory();

    const goToGoogleOauth = useCallback(
        () => {
            if (clientId === null) return;
            const YTVideoId = query.get("v");
            if (YTVideoId)
                localStorage.setItem("currentYTVideo", YTVideoId);
            else
                localStorage.removeItem("currentYTVideo");

            const redirectUri = "http://www.s2c-ingenieurstructure.com:3000";
            const scopes = ["email","profile"];
            //URL AUTHORIZATION
            window.location.href = "https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id="+clientId+"&redirect_uri="+redirectUri+"&scope="+scopes.join(" ");
        }, [clientId]
    )

    const connect = useCallback(
        (code = null) => SessionService.login(code)
                .then(session => {
                    setSession(session);
                    localStorage.setItem('session',JSON.stringify(session))
                    return session;
                })
                .catch(e => console.error(e))
        , []);

    useEffect(() => {

        let curSession;
        let code;
        if ((code = query.get('code'))) {
            connect(code);
        } else if ((curSession = localStorage.getItem('session'))) {
            curSession = JSON.parse(curSession);
            SessionService.testLogin()
                .then(({session}) => session.token === curSession.token && setSession(session));
        } else {
           connect();
        }

        SessionService.reConnect = callback => connect().then(session => callback(session));

        SessionService.getClientId().then(clientId => setClientId(clientId));

        let currentYTVideo;
        if ((currentYTVideo = localStorage.getItem("currentYTVideo"))) {
            localStorage.removeItem("currentYTVideo");
            history.push("/watch?v="+currentYTVideo);
        }
    }, []);


    return (
        <SessionContext.Provider value={{session,goToGoogleOauth,connect}}>
            {children}
        </SessionContext.Provider>
    )
}
