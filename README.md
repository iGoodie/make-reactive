<!-- Logo -->
<p align="center">
  <img src="https://raw.githubusercontent.com/iGoodie/make-reactive/master/.github/assets/logo.svg" height="200px" alt="Logo"/>
</p>

<!-- Slogan -->
<p align="center">
   Make your objects talk to React — automatically
</p>
<!-- Badges -->
<p align="center">

  <!-- Main Badges -->
  <img src="https://raw.githubusercontent.com/iGoodie/paper-editor/master/.github/assets/main-badge.svg" height="20px"/>
  <a href="https://www.npmjs.com/package/@igoodie/make-reactive">
    <img src="https://img.shields.io/npm/v/@igoodie/make-reactive"/>
  </a>
  <a href="https://github.com/iGoodie/make-reactive/tags">
    <img src="https://img.shields.io/github/v/tag/iGoodie/make-reactive"/>
  </a>
  <a href="https://github.com/iGoodie/make-reactive">
    <img src="https://img.shields.io/github/languages/top/iGoodie/make-reactive"/>
  </a>

  <br/>

  <!-- Github Badges -->
  <img src="https://raw.githubusercontent.com/iGoodie/paper-editor/master/.github/assets/github-badge.svg" height="20px"/>
  <a href="https://github.com/iGoodie/make-reactive/commits/master">
    <img src="https://img.shields.io/github/last-commit/iGoodie/make-reactive"/>
  </a>
  <a href="https://github.com/iGoodie/make-reactive/issues">
    <img src="https://img.shields.io/github/issues/iGoodie/make-reactive"/>
  </a>
  <a href="https://github.com/iGoodie/make-reactive/tree/master/src">
    <img src="https://img.shields.io/github/languages/code-size/iGoodie/make-reactive"/>
  </a>

  <br/>

  <!-- Support Badges -->
  <img src="https://raw.githubusercontent.com/iGoodie/paper-editor/master/.github/assets/support-badge.svg" height="20px"/>
  <a href="https://discord.gg/KNxxdvN">
    <img src="https://img.shields.io/discord/610497509437210624?label=discord"/>
  </a>
  <a href="https://www.patreon.com/iGoodie">
    <img src="https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fshieldsio-patreon.vercel.app%2Fapi%3Fusername%3DiGoodie%26type%3Dpatrons"/>
  </a>
</p>

# Description

This library allows you to create React hooks for arbitrary JavaScript objects, making them seamlessly reactive — without rewriting your data structure or wrapping everything in state.

It’s the perfect way to bring reactivity to data types like Map, Set, or even your custom objects — and only trigger rerenders when necessary.

# How to use?

1. Use your favorite package manager to install as dependency

```bash
npm i @igoodie/make-reactive --save-dev
# or
yarn add @igoodie/make-reactive
# or
pnpm add @igoodie/make-reactive
```

2. Start using supported out-of-the-box hooks

```tsx
import {
  useReactiveArray,
  useReactiveMap,
  useReactiveSet,
} from "@igoodie/make-reactive";

export function MyComponent() {
  const array = useReactiveArray<number>();
  const map = useReactiveMap<string, number>();
  const set = useReactiveSet<number>();

  return (
    <>
      <span>{array.length}</span>
      <button onClick={() => array.push(99)}>
        Reactive Array::push, will trigger rerender!
      </button>

      <span>{map.size}</span>
      <button onClick={() => map.set("Hey!", 99)}>
        Reactive Map::set, will trigger rerender!
      </button>

      <span>{set.size}</span>
      <button onClick={() => set.add(99)}>
        Reactive Set::add, will trigger rerender!
      </button>
    </>
  );
}
```

3. Or craft your own Reactive object, if you'd like to!

```ts
// src/entities/Player.ts

export class Player {
  _alive = true;
  _health = 100;
  _equipment = null;

  get health() {
    return this._health;
  }

  damage(quantity: number) {
    this._health -= quantity;
    if (this._health <= 0) this._alive = false;
  }

  equip(item: Item) {
    if (this._equipment === item) return false;
    this._equipment = item;
    return true;
  }
}
```

```ts
// src/hooks/usePlayer.ts

import makeReactive from "@igoodie/make-reactive";

export const usePlayer = makeReactive(
  (player: Player) => player,
  (forceRerender) => ({
    damage: true, // <-- Automatically makes every call reactive

    equip(self, item) {
      const result = self.equip(item);
      if (result) forceRerender(); // <-- Only makes successful "equipment" results rerender
      return result;
    },
  })
);
```

# How does it work under the hood?

The `makeReactive` function uses a combination of React hooks, JavaScript Proxies, and method interception to turn mutable objects like Map, Set, and Array into reactive data sources that trigger rerenders in React.

Here's the breakdown of how it works:

1. **Proxy Wrapping:**
   The object returned by your initiator (e.g., a new Map() or new Array()) is wrapped in a Proxy. This lets us intercept get calls (i.e., property or method accesses).

2. **Method Hooking:**
   When a method is accessed, such as `.set()` on a `Map`, the proxy checks if a hook is defined for it:

   - If value `true` is specified, the method is automatically wrapped to call forceUpdate() after execution.

   - If a custom function is provided, it is executed instead, giving you fine-grained control over how and when rerenders are triggered.

3. **Rerendering:**
   A simple `const [, forceUpdate] = useState(0)` is used to force rerenders. When `forceUpdate(i => i + 1)` is called, it increments the state value, triggering React to update the component.

4. **Memoization & Efficiency:**
   Methods are only wrapped once, using a Map to cache wrapped versions. This avoids redundant closures and improves runtime efficiency.

This design allows you to write minimal glue code while keeping full control over reactivity and performance.

## License

&copy; 2024 Taha Anılcan Metinyurt (iGoodie)

For any part of this work for which the license is applicable, this work is licensed under the [Attribution-ShareAlike 4.0 International](http://creativecommons.org/licenses/by-sa/4.0/) license. (See LICENSE).

<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a>
