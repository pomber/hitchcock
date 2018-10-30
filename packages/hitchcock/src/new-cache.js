import { cachePublisher as cache } from "./spy";
import React from "react";

export const createResource = (fetch, hashFunc) => {
  return {
    preload: input => {
      return cache.preload({
        key: hashFunc ? hashFunc(input) : input,
        getValue: () => fetch(input)
      });
    },
    read: input => {
      return cache.load({
        key: hashFunc ? hashFunc(input) : input,
        getValue: () => fetch(input)
      });
    }
  };
};

export const lazy = fetch => {
  const resource = createResource(fetch, () => "Lazy " + fetch.toString());
  // const Component = React.lazy(fetch);
  // console.log(Component);
  return props => {
    const Component = resource.read().default;
    return <Component {...props} />;
  };
};
