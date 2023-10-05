import makeReactive from "@igoodie/make-reactive";

export const useReactiveSet = makeReactive(<K>() => new Set<K>(), {
  delete: {
    triggersRerender: {
      pre: (thisObject, value) => {
        // If the set has the value, that means it can be deleted
        // Therefore it should trigger rerender
        return thisObject.has(value);
      },
    },
  },
  clear: {
    triggersRerender: {
      pre: (thisObject) => {
        // If the set is not empty, then it will be mutated
        // Therefore it should trigger rerender
        return thisObject.size !== 0;
      },
    },
  },
  add: {
    triggersRerender: {
      pre: (thisObject, value) => {
        // If the set does not contain the value, it means the value will be inserted
        // Therefore it should trigger rerender
        return !thisObject.has(value);
      },
    },
  },
});
