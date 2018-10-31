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

const extractImportName = func => {
  const regex = /([A-z\.\-]*)(\.jsx?|\.tsx?)/;
  const result = func.toString().match(regex);
  if (result) {
    return result[1].trim();
  }
  return func.toString();
};

export const lazy = fetch => {
  const resource = createResource(
    fetch,
    () => `lazy(${extractImportName(fetch)})`
  );
  // const Component = React.lazy(fetch);
  // console.log(Component);
  return props => {
    const Component = resource.read().default;
    return <Component {...props} />;
  };
};
