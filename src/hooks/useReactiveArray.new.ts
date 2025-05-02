import { makeReactive } from "lib/makeReactive.new";

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
    },
    reflectionHooks: {
      set(target, p, newValue, receiver) {
        if (typeof p === "number") {
          forceRerender();
        }
        return Reflect.set(target, p, newValue, receiver);
      },
    },
  })
);
