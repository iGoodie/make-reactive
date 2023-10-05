import { useReactiveSet } from "./hooks/useReactiveSet";
import "./styles.scss";

let rerenderCount = 0;

export const App = () => {
  const set = useReactiveSet<string>();

  return (
    <div className="app">
      <nav>TODO</nav>

      <section>
        <h1>Demo of ./src/hooks/useReactiveSet.ts</h1>

        <div className="actions">
          <button
            onClick={() => {
              set.add(Math.random() + "");
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
    </div>
  );
};
