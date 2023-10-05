import { useReactiveSet } from "src/hooks/useReactiveSet";

let rerenderCount = 0;

export const ReactiveSetDemo = () => {
  const set = useReactiveSet<number>();

  return (
    <section>
      <h1>Demo of ./src/hooks/useReactiveSet.ts</h1>

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
          Rendered <kbd>{++rerenderCount}</kbd> times
        </span>
      </div>

      <pre>set = {JSON.stringify([...set], null, 2)}</pre>
    </section>
  );
};
