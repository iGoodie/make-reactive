import { makeReactive, ReactiveConfig } from "../makeReactive";

export const useReactiveArray = makeReactive(
  <T>(initialValue: T[] = []) => new Array<T>(...initialValue),
  (rerender) => ({
    methodHooks: {
      concat: true,
      copyWithin: true,
      fill: true,
      push: true,
      reverse: true,
      unshift: true,
      sort: true,

      pop(self) {
        if (self.length !== 0) rerender();
        return self.pop();
      },

      shift(self) {
        if (self.length !== 0) rerender();
        return self.shift();
      },

      splice(self, args) {
        const [, , ...items] = args;
        const deleted = self.splice(...args);
        if (deleted.length !== 0) rerender();
        else if (items.length !== 0) rerender();
        return deleted;
      },
    } as ReactiveConfig<Array<unknown>>["methodHooks"],
    proxyHandlerOverrides: {
      set(target, p, newValue, receiver) {
        if (typeof p === "string" && Number(p) >= 0) {
          rerender();
        }
        return Reflect.set(target, p, newValue, receiver);
      },
    },
  }),
);
