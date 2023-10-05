import { useReactiveMap } from "src/hooks/useReactiveMap";

let rerenderCount = 0;

const randomString = (len: number) =>
  "x"
    .repeat(len)
    .replace(
      /./g,
      () =>
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[
          Math.floor(Math.random() * 62)
        ]
    );

export const ReactiveMapDemo = () => {
  const map = useReactiveMap<string, number>();

  return (
    <section>
      <h1>Demo of ./src/hooks/useReactiveMap.ts</h1>

      <div className="actions">
        <button
          onClick={() => {
            map.set(randomString(10), Math.random());
          }}
        >
          Add Random Item
        </button>

        <button
          disabled={map.size === 0}
          onClick={() => {
            const [k, v] = map.entries().next().value;
            map.set(k, v);
          }}
        >
          Try Adding Existing Item
        </button>

        <button onClick={() => map.clear()}>Clear</button>

        <span>
          Rendered <kbd>{++rerenderCount}</kbd> times
        </span>
      </div>

      <pre>map = {JSON.stringify([...map], null, 2)}</pre>
    </section>
  );
};
