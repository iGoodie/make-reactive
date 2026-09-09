export type ConfigFactory<TArgs extends any[], TConfig extends object> =
  | TConfig
  | ((...args: TArgs) => TConfig);

export namespace ConfigFactory {
  export function build<TArgs extends any[], TConfig extends object>(
    builder: ConfigFactory<TArgs, TConfig>,
    args: [...TArgs],
  ): TConfig {
    if (typeof builder === "function") {
      return builder(...args);
    }
    return builder;
  }
}
