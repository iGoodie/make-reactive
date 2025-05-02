import { ConfigBuilder } from "lib/configBuilder";
import { ExtractMethods } from "lib/types";
import { useState } from "react";

function injectMethodHooks<T extends object>(
  obj: T,
  injection: <K extends keyof ExtractMethods<T>>(
    obj: T,
    prop: K,
    target: T[K] & Function,
    thisArg: ThisParameterType<T[K]>,
    argArray: Parameters<AssureFunction<T[K]>>
  ) => ReturnType<AssureFunction<T[K]>>
) {
  const methods = new Map<string | symbol, T[keyof T] & Function>();

  return new Proxy(obj, {
    get(target, p, receiver) {
      const value = target[p as keyof T];

      if (typeof value === "function") {
        if (!methods.has(p)) {
          methods.set(
            p,
            new Proxy(value, {
              apply(target, thisArg, argArray) {
                return injection(
                  obj,
                  p as never,
                  target as never,
                  thisArg as never,
                  argArray as never
                );
              },
            })
          );
        }

        return methods.get(p);
      }

      return Reflect.get(target, p, receiver);
    },
  });
}

type AssureFunction<T> = T extends (...args: any[]) => any ? T : never;

type MethodHooks<T extends object> = {
  [key in keyof ExtractMethods<T>]?:
    | true
    | ((
        target: T[key],
        thisArg: ThisParameterType<T[key]>,
        argArray: Parameters<AssureFunction<T[key]>>
      ) => ReturnType<AssureFunction<T[key]>>);
};

export function makeReactive<TArgs extends unknown[], TObj extends object>(
  initiator: (...args: TArgs) => TObj,
  configBuilder: ConfigBuilder<
    [forceRerender: () => void, originalObject: TObj],
    {
      methodHooks?: MethodHooks<TObj>;
      reflectionHooks?: ProxyHandler<TObj>;
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

      const injected = injectMethodHooks(
        object,
        (obj, prop, target, thisArg, argArray) => {
          const methodHook = config.methodHooks?.[prop];

          if (methodHook != null) {
            if (methodHook === true) {
              forceUpdate((i) => i + 1);
            } else {
              return methodHook(target, thisArg, argArray);
            }
          }

          return Reflect.apply(target, thisArg, argArray);
        }
      );

      if (config.reflectionHooks != null) {
        return new Proxy(injected, config.reflectionHooks);
      }

      return injected;
    });

    return obj;
  };
}
