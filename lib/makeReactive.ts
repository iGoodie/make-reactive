import { ConfigFactory } from "lib/configFactory";
import { ExtractMethods } from "lib/types";
import { useRef, useState, useSyncExternalStore } from "react";

type AssertFunction<T> = T extends (...args: any[]) => any ? T : never;

type ReactiveConfigFactory<TObj extends object> = ConfigFactory<
  [rerender: () => void, originalObject: TObj],
  {
    /**
     * Hooks to make given methods reactive. Used either;
     *
     * - By setting a method name's value to "true", to automatically make them reactive:
     * ```ts
     * export const useReactiveArray = makeReactive(
     *  <T>() => new Array<T>(),
     *  {
     *    methodHooks: {
     *      concat: true,
     *      copyWithin: true,
     *      splice: true,
     *      // .. etc
     *    }
     *  }
     * )
     * ```
     *
     * - Or, by writing a custom hook, for more customized logic.
     * ``` ts
     * export const useReactiveMap = makeReactive(
     *   <K, V>() => new Map<K, V>(),
     *   (forceRerender) => ({
     *     methodHooks: {
     *       delete(self, key) {
     *         if (self.has(key)) forceRerender();
     *         return self.delete(key);
     *       },
     *     },
     *   })
     * );
     *
     */
    methodHooks?: {
      [key in keyof ExtractMethods<TObj>]?:
        | true
        | ((
            self: TObj,
            ...args: Parameters<AssertFunction<TObj[key]>>
          ) => ReturnType<AssertFunction<TObj[key]>>);
    };

    /**
     * makeReactive wraps given object by an ES6 Proxy.
     * Using this config, you can override the Proxy handler.
     */
    proxyHandlerOverrides?: ProxyHandler<TObj>;
  }
>;

export function makeReactive<TArgs extends unknown[], TObj extends object>(
  objectFactory: (...args: TArgs) => TObj,
  configFactory: ReactiveConfigFactory<TObj> = () => ({}),
) {
  return function useReactiveObject(...args: TArgs) {
    const rerenderCb = useRef<() => void>();
    const rerenderCount = useRef(0);

    const rerender = () => {
      rerenderCount.current++;
      rerenderCb.current?.();
    };

    const [obj] = useState(() => {
      return objectFactory(...args);
    });

    const [config] = useState(() => {
      return ConfigFactory.build(configFactory, [rerender, obj]);
    });

    const [proxy] = useState(() => {
      const wrappedMethods = new Map<keyof TObj, Function>();

      function getWrappedMethod(
        key: keyof TObj,
        value: TObj[keyof TObj],
        lazyWrapper: (
          method: (...args: unknown[]) => unknown,
        ) => (...args: unknown[]) => unknown,
      ) {
        if (!wrappedMethods.has(key)) {
          const method = value as (...args: unknown[]) => unknown;
          wrappedMethods.set(key, lazyWrapper(method));
        }

        return wrappedMethods.get(key);
      }

      return new Proxy(obj, {
        ...config.proxyHandlerOverrides,
        get(target, p, receiver) {
          const prop = p as keyof TObj;
          const value =
            config.proxyHandlerOverrides?.get != null
              ? config.proxyHandlerOverrides.get(target, p, receiver)
              : Reflect.get(target, p, receiver);

          if (typeof value !== "function") return value;

          return getWrappedMethod(prop, value, (method) => {
            return function (...args: unknown[]) {
              const methodHook =
                config.methodHooks?.[prop as keyof typeof config.methodHooks];

              if (typeof methodHook === "function") {
                return methodHook(target, ...(args as any));
              }

              const result = method.bind(target)(...args);

              if (methodHook === true) {
                rerender();
              }

              return result;
            }.bind(target);
          });
        },
      });
    });

    useSyncExternalStore(
      (cb) => (rerenderCb.current = cb),
      () => rerenderCount.current,
      () => rerenderCount.current,
    );

    return proxy;
  };
}
