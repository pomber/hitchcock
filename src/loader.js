import { cachePublisher as cache } from "./spy";
import React from "react";

function Suspense({ source, params, children }) {
  const result = cache.load({
    key: source.getName(params),
    getValue: () => source.getValue(params)
  });
  return children(result);
}

export function Loader({ children, fallback, wait, source, params }) {
  const cacheProps = { source, params, children };
  return (
    <React.Timeout ms={wait}>
      {didTimeout => (didTimeout ? fallback : <Suspense {...cacheProps} />)}
    </React.Timeout>
  );
}
