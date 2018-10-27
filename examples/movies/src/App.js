import React, { useState } from "react";
import { useConcurrentState } from "../../../src/utils";
import { MovieListPage } from "./MovieListPage";
import {
  Loader,
  showDirector,
  unstable_createResource as createResource
} from "../../../src/index";
showDirector();

const moviePageSource = {
  getName: () => "./MoviePage",
  getValue: () => import("./MoviePage")
};

// const moviePageResource = createResource(
//   () => import("./MoviePage"),
//   () => "./MoviePage"
// );

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
        <Loader source={moviePageSource} fallback={<b>Load..</b>}>
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
