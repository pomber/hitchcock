import React from "react";
import { showDirector, lazy } from "hitchcock";
import { useConcurrentState } from "hitchcock/dist/utils";
import { Spinner } from "./Spinner";
import { MovieListPage } from "./MovieListPage";
showDirector();

const MoviePage = lazy(() => import("./MoviePage"));

const App = () => {
  const [
    { currentId, showDetail },
    setState,
    deferSetState
  ] = useConcurrentState({
    currentId: null,
    showDetail: false
  });
  const handleMovieClick = id => {
    setState({ currentId: id, showDetail: false });
    deferSetState({ showDetail: true, currentId: id });
  };
  const handleBackClick = () => {
    setState({ currentId: null, showDetail: false });
  };

  return (
    <div>
      {showDetail ? (
        <React.Suspense fallback={<Spinner />}>
          <div>
            <button className="onBack" onClick={handleBackClick}>
              {"👈"}
            </button>
            <MoviePage id={currentId} />
          </div>
        </React.Suspense>
      ) : (
        <MovieListPage onMovieClick={handleMovieClick} loadingId={currentId} />
      )}
    </div>
  );
};

export default App;
