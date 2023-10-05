import makeReactive from "@igoodie/make-reactive";

export const useReactiveArray = makeReactive(<T>() => new Array<T>(), {
  concat: true,
  copyWithin: true,
  splice: true,
  fill: true,
  pop: true,
  push: true,
  reverse: true,
  shift: true,
  unshift: true,
});
