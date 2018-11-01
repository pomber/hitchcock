> “There is no terror in the bang, only in the anticipation of it.”
>
> — <cite>Alfred Hitchcock</cite>

<div align="center">
<a href="https://hitchcock-movies.netlify.com">
<img alt="Suspense Debugger" src="https://user-images.githubusercontent.com/1911623/38225137-d49061ea-36c9-11e8-8042-f3b7e17fb07b.gif" />
</a>
</div>

# Hitchcock [![npm version](https://img.shields.io/npm/v/hitchcock.svg?style=flat)](https://www.npmjs.com/package/hitchcock)

**Hitchcock is a debugging tool for React Suspense.** It wraps your calls to `React.lazy()` and [react-cache](https://github.com/facebook/react/tree/master/packages/react-cache)'s `createResource()` and let you pause, delay or invalidate them.

### 🚨 EXPERIMENTAL 🚨

Use this only for experimenting with the new React API. Hitchcock is inefficient and unstable. Also, I have no idea what I'm doing.

## Demos

- [**Movies**](https://hitchcock-movies.netlify.com):
  A clone of [@karl clone](https://github.com/karl/react-async-io-testbed) of [@dan_abramov demo](https://www.youtube.com/watch?v=6g3g0Q_XVb4)
- [**Suspensify**](https://hitchcock-suspensify.netlify.com):
  A clone of the [suspense demo](https://github.com/jaredpalmer/react-conf-2018) from [Jared Palmer](https://twitter.com/jaredpalmer)'s [React Conf talk](https://www.youtube.com/watch?v=SCQgE4mTnjU&feature=youtu.be).

The code is in the [examples folder](https://github.com/pomber/hitchcock/tree/master/examples).

## Usage

> Try it in [CodeSandbox](https://codesandbox.io/s/ovqlz507pz)

Add the dependency:

```bash
$ yarn add hitchcock
```

Import `lazy` and `createResource` from `hitchcock` (instead of importing them from `react`/`react-cache`):

```js
import {
  lazy,
  unstable_createResource as createResource,
  Director
} from "hitchcock";
```

Also import the `Director` component, and add it somewhere in your app:

````jsx
function YourApp() {
 return (
   <Director>
     <YourStuff />
   </Director>
 );
}

Then use `lazy` and `createResource`.

## Gotchas

- Try to always use the second parameter of `createResource`.
- I'm doing an ugly hack to get the component name from the `lazy()` call. Please, create an issue if it shows the wrong name.

## Contributing

```bash
$ git clone git@github.com:pomber/hitchcock.git
$ cd hitchcock
$ npx lerna bootstrap
````

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
