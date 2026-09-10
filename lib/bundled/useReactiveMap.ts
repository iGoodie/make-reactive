import { makeReactive } from "../makeReactive";

export const useReactiveMap = makeReactive(
  <K, V>() => new Map<K, V>(),
  (rerender) => ({
    methodHooks: {
      delete(self, args) {
        const [key] = args;
        if (self.has(key)) rerender();
        return self.delete(...args);
      },

      clear(self, args) {
        if (self.size !== 0) rerender();
        return self.clear(...args);
      },

      set(self, args) {
        const [key, value] = args;
        if (self.get(key) !== value) rerender();
        return self.set(...args);
      },

      getOrInsert(self, args) {
        const [key] = args;
        if (!self.has(key)) rerender();
        return self.getOrInsert(...args);
      },

      getOrInsertComputed(self, args) {
        const [key] = args;
        if (!self.has(key)) rerender();
        return self.getOrInsertComputed(...args);
      },
    },
    proxyHandlerOverrides: {
      get(target, p) {
        const value = target[p as keyof typeof target];
        return typeof value === "function" ? value.bind(target) : value;
      },
    },
  }),
);
