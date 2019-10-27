import React from "react";
import { lazy } from "hitchcock";
import { Spinner } from "./spinner";
import { MovieListPage } from "./movie-list-page";

const MoviePage = lazy(() => import("./movie-page"), "MoviePage");

const App = () => {
  const [currentId, setCurrentId] = React.useState(null);
  const deferredCurrentId = React.useDeferredValue(currentId, {
    timeoutMs: 3000
  });

  const handleMovieClick = id => {
    setCurrentId(id);
  };

  const handleBackClick = () => {
    setCurrentId(null);
  };

  const showDetail =
    deferredCurrentId !== null && currentId === deferredCurrentId;

  return (
    <React.Suspense fallback={<Spinner />}>
      {!showDetail ? (
        <MovieListPage onMovieClick={handleMovieClick} loadingId={currentId} />
      ) : (
        <div>
          <button className="onBack" onClick={handleBackClick}>
            {"👈"}
          </button>
          <MoviePage id={deferredCurrentId} />
        </div>
      )}
    </React.Suspense>
  );
};

export default App;
