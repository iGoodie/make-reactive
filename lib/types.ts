export type ExtractMethods<
  T extends object,
  $ownProps extends keyof T = keyof Omit<T, "toString" | "toLocaleString">
> = {
  [K in $ownProps as T[K] extends Function ? K : never]: T[K];
};

