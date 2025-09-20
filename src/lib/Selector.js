import { useStore } from "zustand";

export const createSelectors = (store) => {
  const use = {};

  for (const key of Object.keys(store.getState())) {
    use[key] = () => useStore(store, (state) => state[key]);
  }

  return { ...store, use };
};
