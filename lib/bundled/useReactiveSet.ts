import { makeReactive } from "../makeReactive";

export const useReactiveSet = makeReactive(
  <T>() => new Set<T>(),
  (forceRerender) => ({
    methodHooks: {
      delete(self, key) {
        if (self.has(key)) forceRerender();
        return self.delete(key);
      },

      clear(self) {
        if (self.size !== 0) forceRerender();
        return self.clear();
      },

      add(self, value) {
        if (!self.has(value)) forceRerender();
        return self.add(value);
      },
    },
    proxyHandlerOverrides: {
      get(target, p) {
        const value = target[p as keyof typeof target];
        return typeof value === "function" ? value.bind(target) : value;
      },
    },
  })
);
