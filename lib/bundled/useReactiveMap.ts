import { makeReactive } from "../makeReactive";

export const useReactiveMap = makeReactive(
  <K, V>() => new Map<K, V>(),
  (rerender) => ({
    methodHooks: {
      delete(self, key) {
        if (self.has(key)) rerender();
        return self.delete(key);
      },

      clear(self) {
        if (self.size !== 0) rerender();
        return self.clear();
      },

      set(self, key, value) {
        if (self.get(key) !== value) rerender();
        return self.set(key, value);
      },

      getOrInsert(self, key, defaultValue) {
        if (!self.has(key)) rerender();
        return self.getOrInsert(key, defaultValue);
      },

      getOrInsertComputed(self, key, callback) {
        if (!self.has(key)) rerender();
        return self.getOrInsertComputed(key, callback);
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
