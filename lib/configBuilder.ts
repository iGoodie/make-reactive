export type ConfigBuilder<TArgs extends any[], TConfig> =
  | TConfig
  | ((...args: TArgs) => TConfig);

export const ConfigBuilder = {
  calc: <TArgs extends any[], TConfig>(
    builder: ConfigBuilder<TArgs, TConfig>
  ) => {
    if(typeof builder === "function"){
      return
    }
  },
};
