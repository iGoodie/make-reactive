import { ConfigFactory } from "lib/configFactory";
import { useRef, useState, useSyncExternalStore } from "react";

type ExtractMethods<TObj extends object> = {
  [K in keyof TObj as TObj[K] extends Function ? K : never]: TObj[K];
};

export type MethodHook<
  TObj extends object,
  TMethod extends keyof TObj,
> = TObj[TMethod] extends (...args: infer U) => infer V
  ? (self: TObj, args: U) => V
  : never;

export type ReactiveConfig<TObj extends object> = {
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
    [K in keyof ExtractMethods<TObj>]?: true | MethodHook<TObj, K>;
  };

  /**
   * makeReactive wraps given object by an ES6 Proxy.
   * Using this config, you can override the Proxy handler.
   */
  proxyHandlerOverrides?: ProxyHandler<TObj>;
};

export type ReactiveConfigFactory<TObj extends object> = ConfigFactory<
  [rerender: () => void, originalObject: TObj],
  ReactiveConfig<TObj>
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
          wrappedMethods.set(key, lazyWrapper(method).bind(obj));
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
                return methodHook(target, args);
              }

              const result = method.bind(target)(...args);

              if (methodHook === true) {
                rerender();
              }

              return result;
            };
          });
        },
      });
    });

    useSyncExternalStore(
      (cb) => {
        rerenderCb.current = cb;
        return () => {};
      },
      () => rerenderCount.current,
      () => rerenderCount.current,
    );

    return proxy;
  };
}
