import { makeReactive } from "@igoodie/make-reactive";

export const useReactiveMap = makeReactive(
  <K, V>() => new Map<K, V>(),
  (forceRerender, obj) => ({
    methodHooks: {
      delete(target, thisArg, argArray) {
        const [key] = argArray;
        if (obj.has(key)) forceRerender();
        return Reflect.apply(target, thisArg, argArray);
      },

      clear(target, thisArg, argArray) {
        if (obj.size !== 0) forceRerender();
        return Reflect.apply(target, thisArg, argArray);
      },

      set(target, thisArg, argArray) {
        const [key, value] = argArray;
        if (obj.get(key) !== value) forceRerender();
        return Reflect.apply(target, thisArg, argArray);
      },
    },
  })
);
