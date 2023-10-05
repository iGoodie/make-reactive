import { useEffect, useRef, useState } from "react";

/* ---------------------------- */

type PickMatching<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};

type ExtractMethods<T> = PickMatching<T, Function>;

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
    | (T[methodName] extends Function
        ?
            | {
                triggersRerender?: RerenderPredicate<T, methodName>;
                patch: PatcherMethod<T, methodName>;
              }
            | {
                triggersRerender: RerenderPredicate<T, methodName>;
                patch?: PatcherMethod<T, methodName>;
              }
            | {
                triggersRerender: RerenderPredicate<T, methodName>;
                patch: PatcherMethod<T, methodName>;
              }
        : never);
};

export function makeReactive<TArgs extends unknown[], T extends object>(
  initiator: (...args: TArgs) => T,
  targetMethods: Partial<TargetMethodsConfig<T>>
) {
  return function useReactiveSubject(...args: TArgs) {
    const observer = useRef<MutationObserver>(null); // TODO: 3rd param for field mutation observer
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
            const shallRerender =
              // @ts-expect-error args are guaranteed to be the corresponding method's arguments
              targetConfig.triggersRerender?.(this, ...args) ?? true;

            const superResult =
              // @ts-expect-error superMethod is guaranteed to be the corresponding Function
              targetConfig.patch?.(superMethod, this, ...args) ??
              superMethod.call(this, ...args);

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
