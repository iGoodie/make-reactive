import { useEffect, useRef } from "react";
import { useReactiveArray } from "src/hooks/useReactiveArray.new";

export const ReactiveArrayDemo = () => {
  const array = useReactiveArray<number>();

  const rerenderCount = useRef(0);

  useEffect(() => {
    if (array[0] === 10) return;
    console.log("TIMBER!", array[0]);
    if (!array[0]) array[0] = 0;
    array[0]++;
  }, [array[0]]);

  return (
    <section>
      <h1>Demo of ./src/hooks/useReactiveArray.ts</h1>

      <div className="actions">
        <button
          onClick={() => {
            array.push(Math.random());
          }}
        >
          Add Random Item
        </button>

        <button onClick={() => array.pop()}>Pop Item</button>

        <button onClick={() => array.splice(0)}>Clear</button>

        <span>
          Rendered <kbd>{++rerenderCount.current}</kbd> times
        </span>
      </div>

      <pre>array = {JSON.stringify(array, null, 2)}</pre>
    </section>
  );
};
