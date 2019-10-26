import { useState } from "react";

export function useConcurrentState(defaultState) {
  const [state, setState] = useState(defaultState);
  const deferSetState = updater => setTimeout(() => setState(updater), 0);
  return [state, setState, deferSetState];
}
