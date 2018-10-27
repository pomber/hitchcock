import React, { useState } from "react";
import { Loader, showDirector } from "../../../src/index";
import { useConcurrentState } from "../../../src/utils";
import { MovieListPage } from "./MovieListPage";
showDirector();

const moviePageSource = {
  getName: () => "./MoviePage",
  getValue: () => import("./MoviePage")
};

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
        <Loader source={moviePageSource} fallback={<div>Loading...</div>}>
          {({ MoviePage }) => (
            <div>
              <button className="onBack" onClick={handleBackClick}>
                {"👈"}
              </button>
              <MoviePage id={currentId} />
            </div>
          )}
        </Loader>
      ) : (
        <MovieListPage onMovieClick={handleMovieClick} loadingId={currentId} />
      )}
    </div>
  );
};

export default App;
