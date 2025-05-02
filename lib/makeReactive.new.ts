import { ConfigBuilder } from "lib/configBuilder";
import { ExtractMethods } from "lib/types";
import { useState } from "react";

function injectMethodHooks<T extends object>(
  obj: T,
  injection: ProxyHandler<T[keyof T] & Function>["apply"]
) {
  const methods = new Map<string | symbol, T[keyof T] & Function>();

  return new Proxy(obj, {
    get(target, p, receiver) {
      const value = target[p as keyof T];

      if (typeof value === "function") {
        if (!methods.has(p)) {
          methods.set(p, new Proxy(value, { apply: injection }));
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
    [forceRerender: () => void, obj: TObj],
    {
      methodHooks?: MethodHooks<TObj>;
      reflectionHooks?: ProxyHandler<TObj>;
    }
  >
) {
  return function useReactiveObject(...args: TArgs) {
    const [, forceUpdate] = useState(0);

    // const config = ConfigBuilder.calc(configBuilder, forceUpdate, obj);

    const [obj] = useState<TObj>(() => {
      return injectMethodHooks(
        initiator(...args),
        (target, thisArg, argArray) => {
          forceUpdate((i) => i + 1);
          return Reflect.apply(target, thisArg, argArray);
        }
      );
    });

    return obj;
  };
}

// const useReactiveMap = makeReactive(<K, V>() => new Map<K, V>());

// const map = useReactiveMap();
