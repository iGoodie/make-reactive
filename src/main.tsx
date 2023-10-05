import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { useReactiveSet } from "src/hooks/useReactiveSet";

const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
