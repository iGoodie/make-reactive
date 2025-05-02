import { makeReactive } from "lib/makeReactive";

export const useReactiveArray = makeReactive(
  <T>(initialValue: T[] = []) => new Array<T>(...initialValue),
  (forceRerender) => ({
    methodHooks: {
      concat: true,
      copyWithin: true,
      splice: true,
      fill: true,
      pop: true,
      push: true,
      reverse: true,
      shift: true,
      unshift: true,
      sort: true,
    },
    proxyHandlerOverrides: {
      set(target, p, newValue, receiver) {
        if (typeof p === "string" && Number(p) >= 0) {
          forceRerender();
        }
        return Reflect.set(target, p, newValue, receiver);
      },
    },
  })
);
