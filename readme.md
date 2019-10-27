> “There is no terror in the bang, only in the anticipation of it.”
>
> — <cite>Alfred Hitchcock</cite>

<div align="center">
<a href="https://hitchcock-movies.netlify.com">
<img alt="Suspense Debugger" src="https://user-images.githubusercontent.com/1911623/38225137-d49061ea-36c9-11e8-8042-f3b7e17fb07b.gif" />
</a>
</div>

# Hitchcock [![npm version](https://img.shields.io/npm/v/hitchcock.svg?style=flat)](https://www.npmjs.com/package/hitchcock)

**Hitchcock is a debugging tool for React Suspense.** It wraps your calls to `React.lazy()`, provides a simple cache ([based on react-cache](https://github.com/facebook/react/tree/master/packages/react-cache)) and let you pause, delay or invalidate your promises.

### 🚨 EXPERIMENTAL 🚨

Use this only for experimenting with [the new React Concurrent Mode](https://reactjs.org/docs/concurrent-mode-intro.html). Hitchcock is inefficient and unstable. Also, I have no idea what I'm doing.

## Demos

- [**Movies**](https://hitchcock-movies.netlify.com):
  A clone of [@karl clone](https://github.com/karl/react-async-io-testbed) of [@dan_abramov demo](https://www.youtube.com/watch?v=6g3g0Q_XVb4)
- [**Suspensify**](https://hitchcock-suspensify.netlify.com):
  A clone of the [suspense demo](https://github.com/jaredpalmer/react-conf-2018) from [Jared Palmer](https://twitter.com/jaredpalmer)'s [React Conf talk](https://www.youtube.com/watch?v=SCQgE4mTnjU&feature=youtu.be).

The code is in the [examples folder](https://github.com/pomber/hitchcock/tree/master/examples).

## Usage

> Try it on [CodeSandbox](https://codesandbox.io/s/ovqlz507pz)

Add the dependency:

```bash
$ yarn add hitchcock
```

### Director

Import the `Director` component and add it somewhere in your app:

```jsx
import { Director } from "hitchcock";

function YourApp() {
  return (
    <Director>
      <YourStuff />
    </Director>
  );
}
```

### Lazy

Instead of using `React.lazy` import `lazy` from hitchcock:

```jsx
import { lazy } from "hitchcock";

const HomePage = lazy(() => import("./components/HomePage"));

// Hitchcock's lazy accepts a second parameter with the name of the component:
const ArtistPage = lazy(() => import("./components/ArtistPage"), "ArtistPage");
// it's optional, but recommended, it isn't always easy to guess the name from the import
```

### createResource

```jsx
import { createResource } from "hitchcock";

const BeerResource = createResource(
  id =>
    fetch(`https://api.punkapi.com/v2/beers/${id}`)
      .then(r => r.json())
      .then(d => d[0]),
  id => `beer-${id}`
);

function Beer({ beerId }) {
  const beer = BeerResource.read(beerId);
  return (
    <>
      <h1>{beer.name}</h1>
      <p>{beer.description}</p>
    </>
  );
}
```

`createResource` has two parameters. The first one is a function that returns a promise. The second one is a function that returns an id, that id is used as the key in the cache and also is used as the name of the resource in the debugger.

It returns a `resource` with a `read` method that will suspend a component until the resource is ready (when the promise resolves).

### Waterfalls

[React docs warn about using Suspense as a way to start fetching data when a component renders](https://reactjs.org/docs/concurrent-mode-suspense.html#for-library-authors). The recommended approach is to start fetching before rendering, for example, in an event handler. Hitchcock doesn't solve this problem, but it provides a `preload` method if you want to try:

```jsx
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { createResource, Director } from "hitchcock";

const BeerResource = createResource(
  id =>
    fetch(`https://api.punkapi.com/v2/beers/${id}`)
      .then(r => r.json())
      .then(d => d[0]),
  id => `beer-${id}`
);

function App() {
  const [beerId, setBeerId] = React.useState(0);
  const deferredBeerId = React.useDeferredValue(beerId, { timeoutMs: 1000 });

  const showBeer = deferredBeerId > 0;

  const handleChange = e => {
    const newBeerId = +e.target.value;
    BeerResource.preload(newBeerId);
    setBeerId(newBeerId);
  };

  return (
    <Director>
      Beer # <input type="number" value={beerId} onChange={handleChange} />
      <Suspense fallback={<div>{`Loading beer #${beerId}...`}</div>}>
        {showBeer && <Beer beerId={deferredBeerId} />}
      </Suspense>
    </Director>
  );
}

function Beer({ beerId }) {
  const beer = BeerResource.read(beerId);
  return (
    <>
      <h1>{beer.name}</h1>
      <p>{beer.description}</p>
    </>
  );
}

const container = document.getElementById("root");
ReactDOM.createRoot(container).render(<App />);
```

## Contributing

```bash
$ git clone git@github.com:pomber/hitchcock.git
$ cd hitchcock
$ npx lerna bootstrap
```

Run the examples:

```bash
$ yarn start:example movies
$ yarn start:example suspensify
```

Publish new version:

```bash
$ yarn build:packages
$ npx lerna publish
```

## License

Released under MIT license.
