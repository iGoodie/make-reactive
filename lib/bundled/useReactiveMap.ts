import { makeReactive } from "lib/makeReactive";

export const useReactiveMap = makeReactive(
  <K, V>() => new Map<K, V>(),
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

      set(self, key, value) {
        if (self.get(key) !== value) forceRerender();
        return self.set(key, value);
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
