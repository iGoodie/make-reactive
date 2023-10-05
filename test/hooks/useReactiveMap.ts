import { makeReactive } from "../../lib/make-reactive";

export const useReactiveSet = makeReactive(<K>() => new Set<K>(), {
  add: true,
  clear: true,
  delete: true,
});

export const useReactiveMap = makeReactive(<K, V>() => new Map<K, V>(), {
  clear: true,
  delete: true,
  // set(thisObject, key, value) {
  //   return thisObject.get(key) !== value;
  // },
  // get: {
  //   triggersRerender() {
  //     return counter++ % 5 == 0;
  //   },
  // },
});

// export const useReactiveMap = makeReactive(<K, V>() => new Map<K, V>(), {
//   clear: true,
//   delete: true,
//   set: (thisValue, key, value) => {
//     return thisValue.get(key) !== value;
//   },
// });

const set = useReactiveSet<string>();
const map = useReactiveMap<string, number>();
