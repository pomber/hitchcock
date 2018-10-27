import React, { Component } from "react";
import State from "louis-xiv";
import { Loader, showDirector } from "hitchcock";
import { MovieListPage } from "./MovieListPage";
showDirector();

const moviePageSource = {
  getName: () => "./MoviePage",
  getValue: () => import("./MoviePage")
};

const App = () => (
  <State
    init={{ currentId: null, showDetail: false }}
    map={(state, setState, deferredSetState) => ({
      ...state,
      handleMovieClick: id => {
        setState({ currentId: id });
        deferredSetState({ showDetail: true });
      },
      handleBackClick: () => {
        setState({ currentId: null, showDetail: false });
      }
    })}
  >
    {({ currentId, showDetail, handleMovieClick, handleBackClick }) => (
      <div>
        {showDetail ? (
          <Loader source={moviePageSource}>
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
          <MovieListPage
            onMovieClick={handleMovieClick}
            loadingId={currentId}
          />
        )}
      </div>
    )}
  </State>
);

export default App;
