export type ConfigBuilder<TArgs extends any[], TConfig extends object> =
  | TConfig
  | ((...args: TArgs) => TConfig);

export const ConfigBuilder = {
  calc: <TArgs extends any[], TConfig extends object>(
    builder: ConfigBuilder<TArgs, TConfig>,
    ...args: TArgs
  ) => {
    if (typeof builder === "function") {
      return builder(...args);
    }

    return builder;
  },
};
