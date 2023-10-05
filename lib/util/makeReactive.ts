import { useEffect, useRef, useState } from "react";

/* ---------------------------- */

type ExtractMethods<T extends object> = {
  [K in keyof T as T[K] extends Function ? K : never]: T[K];
};

/* ---------------------------- */

export type Initiator<T> = () => T;

export type RerenderPredicate<T extends object, M extends keyof T> = (
  thisObject: T,
  // @ts-expect-error It is guaranteed for T[M] to be a function
  ...args: Parameters<T[M]>
) => boolean;

export type PatcherMethod<T extends object, M extends keyof T> = (
  superMethod: T[M],
  thisObject: T,
  // @ts-expect-error It is guaranteed for T[M] to be a function
  ...args: Parameters<T[M]>
) => // @ts-expect-error It is guaranteed for T[M] to be a function
ReturnType<T[M]>;

/* ---------------------------- */

export type TargetMethodsConfig<T extends object> = {
  [methodName in keyof ExtractMethods<T>]:
    | true
    | {
        triggersRerender?: {
          /**
           * Just before the actual call is executed,
           * this hook checks wether this method call
           * should trigger rerender or not.
           */
          pre?: RerenderPredicate<T, methodName>;
          /**
           * Right after the actual call is executed,
           * this hook checks wether this method call
           * should trigger rerender or not.
           */
          post?: RerenderPredicate<T, methodName>;
        };
      };
};

export function makeReactive<TArgs extends unknown[], T extends object>(
  initiator: (...args: TArgs) => T,
  targetMethods: Partial<TargetMethodsConfig<T>>
) {
  return function useReactiveSubject(...args: TArgs) {
    // const observer = useRef<MutationObserver>(null); // TODO: 3rd param for field mutation observer
    const [subject] = useState<T>(() => initiator(...args));
    const [, update] = useState(0);

    useEffect(() => {
      // Monkey patch given methods
      let targetMethod: keyof ExtractMethods<T>;
      for (targetMethod in targetMethods) {
        const targetConfig = targetMethods[targetMethod];
        const superMethod = subject[targetMethod] as Function;

        // Prepare the patch
        let patch: Function;
        if (targetConfig === true) {
          patch = function (this: ThisType<T>, ...args: unknown[]) {
            const superResult = superMethod.call(this, ...args);
            update((i) => i + 1);
            return superResult;
          };
        } else {
          patch = function (this: T, ...args: unknown[]) {
            let shallRerender = targetConfig === true;

            // @ts-expect-error args are guaranteed to be the corresponding method's arguments
            if (targetConfig?.triggersRerender?.pre?.(this, ...args))
              shallRerender ||= shallRerender;

            const superResult = superMethod.call(this, ...args);

            // @ts-expect-error args are guaranteed to be the corresponding method's arguments
            if (targetConfig?.triggersRerender?.post?.(this, ...args))
              shallRerender ||= shallRerender;

            if (shallRerender) {
              update((i) => i + 1);
            }

            return superResult;
          };
        }

        // Finally, bind the patch
        subject[targetMethod] = patch as (typeof subject)[typeof targetMethod];
      }
    }, [subject]);

    return subject;
  };
}
