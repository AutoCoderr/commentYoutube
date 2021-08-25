import './App.css';
import './css/navbar.css';
import {BrowserRouter, Link, Route} from "react-router-dom";
import React from 'react';
import {SessionProvider,SessionContext} from "./contexts/SessionContext";
import Watch from "./components/Watch";
import Index from "./components/Index";

function App() {

    return (
      <BrowserRouter>
        <header>
          <nav>
              <div className="navbar-left-part">
                  <a className="navbar-brand">Comment Youtube</a>
              </div>
              <div className="navbar-right-part">
                  <ul className="navbar-menu">
                      <SessionProvider>
                          <SessionContext.Consumer>
                              { session =>
                                  session != null && session.type === "google" ?
                                      (<>
                                          <li className="nav-item">
                                              <a className="nav-link active" aria-current="page" href="#">Passer en anonyme</a>
                                          </li>
                                      </>)
                                      :
                                      (<>
                                          <li className="nav-item">
                                              <a className="nav-link active" aria-current="page" href="#">Connexion Google</a>
                                          </li>
                                      </>)
                              }
                          </SessionContext.Consumer>
                      </SessionProvider>
                  </ul>
              </div>
          </nav>
        </header>
        <main>
            <SessionProvider>
                <Route exact path="/" component={Index}/>
                <Route exact path="/watch" component={Watch}/>
            </SessionProvider>
        </main>

      </BrowserRouter>
  );
}

export default App;
