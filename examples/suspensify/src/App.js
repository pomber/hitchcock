import React from "react";
import { Router } from "@reach/router";
import Nav from "./components/Nav/Nav";
import PlayerProvider from "./components/PlayerProvider";
import { Spinner } from "./components/Spinner";
import { lazy } from "hitchcock";

const HomePage = lazy(() => import("./components/HomePage"));
const ArtistPage = lazy(() => import("./components/ArtistPage"));

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <React.Suspense fallback={<Spinner size="large" />}>
          <PlayerProvider>
            <Router>
              <Nav default>
                <HomePage path="/" />
                <ArtistPage path="/artist/:id" />
              </Nav>
            </Router>
          </PlayerProvider>
        </React.Suspense>
      </div>
    );
  }
}

export default App;
