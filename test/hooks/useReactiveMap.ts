import makeReactive from "../../lib/make-reactive";

export const useReactiveSet = makeReactive(<K>() => new Set<K>(), {
  add: true,
  clear: true,
  delete: true,
});

export const useReactiveMap = makeReactive(<K, V>() => new Map<K, V>(), {
  clear: true,
  delete: true,
  set: {
    preCheck: (thisObject, key, value) => {
      return thisObject.get(key) !== value;
    },
  },
});

const set = useReactiveSet<string>();
const map = useReactiveMap<string, number>();
