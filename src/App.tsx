import { ReactiveArrayDemo } from "src/demos/ReactiveArrayDemo";
import { ReactiveMapDemo } from "src/demos/ReactiveMapDemo";
import { ReactiveSetDemo } from "src/demos/ReactiveSetDemo";

import LogoSvg from "./assets/logo.svg";

import "./styles.scss";

export const App = () => {
  return (
    <div className="app">
      <img
        src={LogoSvg}
        style={{
          width: "20vw",
          gridColumn: "1 / span 2",
          margin: "0 auto",
        }}
      />

      <nav>
        <a href={"https://github.com/iGoodie/make-reactive"} target="_blank">
          Github Repo
        </a>
        <span>•</span>
        <a href={"https://www.npmjs.com/package/@igoodie/make-reactive"} target="_blank">
          NPM Package
        </a>
      </nav>

      <div className="grid">
        <div>
          <h1>Reactive Array Demo</h1>
          <ReactiveArrayDemo />
        </div>

        <div>
          <h1>Reactive Map Demo</h1>
          <ReactiveMapDemo />
        </div>

        <div>
          <h1>Reactive Set Demo</h1>
          <ReactiveSetDemo />
        </div>
      </div>
    </div>
  );
};
