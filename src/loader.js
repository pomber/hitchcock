import { cachePublisher as cache } from "./spy";
import React from "react";

function InnerSuspense({ source, params, children }) {
  const result = cache.load({
    key: source.getName(params),
    getValue: () => source.getValue(params)
  });
  return children(result);
}

export function Loader({ children, fallback, wait, source, params }) {
  const cacheProps = { source, params, children };
  return (
    <React.Suspense maxDuration={wait} fallback={fallback}>
      <InnerSuspense {...cacheProps} />
    </React.Suspense>
  );
}
