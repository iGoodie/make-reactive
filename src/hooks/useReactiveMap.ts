import makeReactive from "@igoodie/make-reactive";

export const useReactiveMap = makeReactive(<K, V>() => new Map<K, V>(), {
  delete: {
    triggersRerender: {
      pre: (thisObject, key) => {
        // If the map has the key, that means it can be deleted
        // Therefore it should trigger rerender
        return thisObject.has(key);
      },
    },
  },
  clear: {
    triggersRerender: {
      pre: (thisObject) => {
        // If the map is not empty, then it will be mutated
        // Therefore it should trigger rerender
        return thisObject.size !== 0;
      },
    },
  },
  set: {
    triggersRerender: {
      pre: (thisObject, key, value) => {
        // If the map does not have the same key-value pair, then it will be mutated
        // Therefore it should trigger rerender
        return thisObject.get(key) !== value;
      },
    },
  },
});
