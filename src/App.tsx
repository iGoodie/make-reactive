import { useReactiveSet } from "./hooks/useReactiveSet";

export const App = () => {
  const set = useReactiveSet<string>();
  // const map = useReactiveMap<string, number>();

  return (
    <div>
      <button
        onClick={() => {
          set.add(Math.random() + "");
        }}
      >
        Add Item
      </button>

      <pre>{JSON.stringify([...set], null, 2)}</pre>
    </div>
  );
};
