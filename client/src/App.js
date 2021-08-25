import './App.css';
import './css/navbar.css';
import {BrowserRouter, Route} from "react-router-dom";
import React from "react";
import {SessionProvider,SessionContext} from "./contexts/SessionContext";
import Watch from "./components/Watch";
import Index from "./components/Index";

function App() {

    return (
      <BrowserRouter>
          <SessionProvider>
            <header>
              <nav>
                  <div className="navbar-left-part">
                      <a className="navbar-brand">Comment Youtube</a>
                  </div>
                  <div className="navbar-right-part">
                      <ul className="navbar-menu">
                          <SessionContext.Consumer>
                              { ({session,goToGoogleOauth,connect}) =>
                                  session != null && session.type === "google" ?
                                      (<>
                                          <li className="nav-item">
                                              <a className="nav-link active" aria-current="page" onClick={connect}>Passer en anonyme</a>
                                          </li>
                                      </>)
                                      :
                                      (<>
                                          <li className="nav-item">
                                              <a className="nav-link active" aria-current="page"
                                                 onClick={goToGoogleOauth}
                                              >Connexion Google</a>
                                          </li>
                                      </>)
                              }
                          </SessionContext.Consumer>
                      </ul>
                  </div>
              </nav>
            </header>
            <main>
                <Route exact path="/" component={Index}/>
                <Route exact path="/watch" component={Watch}/>
            </main>
          </SessionProvider>
      </BrowserRouter>
  );
}

export default App;
