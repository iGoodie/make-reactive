import { ConfigBuilder } from "lib/configBuilder";
import { ExtractMethods } from "lib/types";
import { useState } from "react";

type AssureFunction<T> = T extends (...args: any[]) => any ? T : never;

type MethodHooks<T extends object> = {
  [key in keyof ExtractMethods<T>]?:
    | true
    | ((
        self: T,
        ...args: Parameters<AssureFunction<T[key]>>
      ) => ReturnType<AssureFunction<T[key]>>);
};

export function makeReactive<TArgs extends unknown[], TObj extends object>(
  initiator: (...args: TArgs) => TObj,
  configBuilder: ConfigBuilder<
    [forceRerender: () => void, originalObject: TObj],
    {
      methodHooks?: MethodHooks<TObj>;
      proxyHandlerOverrides?: ProxyHandler<TObj>;
    }
  >
) {
  return function useReactiveObject(...args: TArgs) {
    const [, forceUpdate] = useState(0);

    const [obj] = useState<TObj>(() => {
      const object = initiator(...args);

      const config = ConfigBuilder.calc(
        configBuilder,
        () => forceUpdate((i) => i + 1),
        object
      );

      const wrappedMethods = new Map<string | symbol, Function>();

      const injected = new Proxy(object, {
        ...config.proxyHandlerOverrides,

        get(target, p, receiver) {
          const value =
            config.proxyHandlerOverrides?.get != null
              ? config.proxyHandlerOverrides.get(target, p, receiver)
              : Reflect.get(target, p, receiver);

          if (typeof value === "function") {
            if (!wrappedMethods.has(p)) {
              wrappedMethods.set(
                p,
                function (...args: any[]) {
                  const methodHook =
                    config.methodHooks?.[p as keyof typeof config.methodHooks];

                  if (typeof methodHook === "function") {
                    return methodHook(target, ...(args as never));
                  }

                  if (methodHook === true) {
                    forceUpdate((i) => i + 1);
                  }

                  return (value as Function).bind(target)(...args);
                }.bind(target)
              );
            }
            return wrappedMethods.get(p);
          }

          return value;
        },
      });

      return injected;
    });

    return obj;
  };
}
