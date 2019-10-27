import React from "react";
import Nav from "./components/Nav/Nav";
import PlayerProvider from "./components/PlayerProvider";
import { Spinner } from "./components/Spinner";
import { lazy } from "hitchcock";

const HomePage = lazy(() => import("./components/HomePage"), "HomePage");
const ArtistPage = lazy(() => import("./components/ArtistPage"), "ArtistPage");

function App() {
  const [page, setPage] = React.useState({ name: "home", id: null });
  const goToArtist = artistId => {
    setPage({ name: "artist", id: artistId });
  };
  const goHome = () => setPage({ name: "home" });
  return (
    <div className="app">
      <React.Suspense fallback={<Spinner size="large" />}>
        <PlayerProvider>
          <Nav pageName={page.name} goHome={goHome}>
            {page.name === "home" ? (
              <HomePage goToArtist={goToArtist} />
            ) : page.name === "artist" ? (
              <ArtistPage id={page.id} />
            ) : (
              <NotImplemented goHome={goHome} />
            )}
          </Nav>
        </PlayerProvider>
      </React.Suspense>
    </div>
  );
}

const NotImplemented = ({ goHome }) => (
  <div>
    Not implemented. <a onClick={goHome}>Go Home</a>.
  </div>
);

export default App;
