import { cachePublisher as cache } from "./spy";

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
