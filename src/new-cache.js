import { cachePublisher as cache } from "./spy";
import React from "react";

export const createResource = (fetch, hashFunc) => {
  return {
    read: input => {
      return cache.load({
        key: hashFunc ? hashFunc(input) : input,
        getValue: () => fetch(input)
      });
    }
  };
};

export const lazy = fetch => {
  const resource = createResource(fetch, () => "LazyComponent");
  return props => {
    const Component = resource.read().default;
    return <Component {...props} />;
  };
};
