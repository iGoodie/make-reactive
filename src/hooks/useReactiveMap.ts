import { makeReactive } from "@igoodie/make-reactive";

export const useReactiveMap = makeReactive(
  <K, V>() => new Map<K, V>(),
  (forceRerender, originalObject) => ({
    methodHooks: {
      delete(target, thisArg, argArray) {
        const [key] = argArray;
        if (originalObject.has(key)) forceRerender();
        return Reflect.apply(target, thisArg, argArray);
      },

      clear(target, thisArg, argArray) {
        if (originalObject.size !== 0) forceRerender();
        return Reflect.apply(target, thisArg, argArray);
      },

      set(target, thisArg, argArray) {
        const [key, value] = argArray;
        if (originalObject.get(key) !== value) forceRerender();
        return Reflect.apply(target, thisArg, argArray);
      },
    },
  })
);
