> “There is no terror in the bang, only in the anticipation of it.”
>
> — <cite>Alfred Hitchcock</cite>

[![npm version](https://img.shields.io/npm/v/hitchcock.svg?style=flat)](https://www.npmjs.com/package/hitchcock)

Hitchcock is similar to [simple-cache-provider](https://github.com/facebook/react/tree/master/packages/simple-cache-provider) with two extras:

* a render-props API
* a "suspense" debugger

## 🚨 EXPERIMENTAL 🚨

First: this depends on alpha versions of react and react-dom and uses very unstable APIs. Second: I have no idea what I'm doing.

Hitchcock's API looks like this (for now):

```js
import { fetchMovieDetails } from "./api";
import { Loader } from "hitchcock";

const detailsSource = {
  getName: id => `/movies/${id}/details`, // this becomes the cache key
  getValue: id => fetchMovieDetails(id) // this is the "suspender", it returns a promise
};

const MovieDetails = ({ id }) => (
  <Loader source={detailsSource} params={id}>
    {movie => (
      <div>
        <MoviePoster src={movie.poster} />
        <h1>{movie.title}</h1>
        <MovieMetrics {...movie} />
      </div>
    )}
  </Loader>
);
```

And the debugger:

![Suspense Debugger](https://media.giphy.com/media/vFKqnCdLPNOKc/giphy.gif)

## Examples

* A clone of [@karl clone](https://github.com/karl/react-async-io-testbed) of [@dan_abramov demo](https://www.youtube.com/watch?v=6g3g0Q_XVb4) ported to hitchcock: https://codesandbox.io/s/kk2v1op3m5

## To do

* [x] Push something
* [ ] Write readme
* [ ] Examples
* [ ] Refactor
* [ ] Compat with simple-cache-provider
* [ ] Production build without deps
* [ ] Update to-do list

## License

Released under MIT license.
