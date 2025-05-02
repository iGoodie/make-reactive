import { ReactiveArrayDemo } from "src/demos/ReactiveArrayDemo";
import { ReactiveMapDemo } from "src/demos/ReactiveMapDemo";

import "./styles.scss";

export const App = () => {
  return (
    <div className="app">
      <div>
        <h1>Reactive Array Demo</h1>
        <ReactiveArrayDemo />
      </div>

      <div>
        <h1>Reactive Map Demo</h1>
        <ReactiveMapDemo />
      </div>
    </div>
  );
};
