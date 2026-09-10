import { makeReactive } from "../makeReactive";

export const useReactiveSet = makeReactive(
  <T>() => new Set<T>(),
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

      add(self, args) {
        const [value] = args;
        if (!self.has(value)) rerender();
        return self.add(...args);
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
