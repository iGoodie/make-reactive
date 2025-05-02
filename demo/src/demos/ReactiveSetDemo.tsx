import { useReactiveSet } from "@igoodie/make-reactive";
import { useRef } from "react";

export const ReactiveSetDemo = () => {
  const set = useReactiveSet<number>();

  const rerenderCount = useRef(0);

  return (
    <section>
      <div className="actions">
        <button
          onClick={() => {
            set.add(Math.random());
          }}
        >
          Add Random Item
        </button>

        <button
          disabled={set.size === 0}
          onClick={() => {
            set.add([...set][0]);
          }}
        >
          Try Adding Existing Item
        </button>

        <button onClick={() => set.clear()}>Clear</button>

        <span>
          Rendered <kbd>{++rerenderCount.current}</kbd> times
        </span>
      </div>

      <pre>
        set.size = {set.size}
        {"\n\n"}
        set = {JSON.stringify([...set], null, 2)}
      </pre>

      <a
        href="https://github.com/iGoodie/make-reactive/blob/master/demo/src/demos/ReactiveSetDemo.tsx"
        target="_blank"
      >
        ^ See Code
      </a>
    </section>
  );
};
