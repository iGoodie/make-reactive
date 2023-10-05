import makeReactive from "@igoodie/make-reactive";

export const useReactiveSet = makeReactive(<K>() => new Set<K>(), {
  add: true,
  clear: true,
  delete: true,
});
