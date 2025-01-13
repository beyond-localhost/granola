import "./misc/index.css"; // embed tailwindcss
import "./lib/bootstrap";

import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { bootStrapPromise } from "./lib/bootstrap";
import { LogDebug, LogError } from "@/runtime/runtime";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  bootStrapPromise
    .then(() => {
      root.render(
        <StrictMode>
          <RouterProvider router={router} />
        </StrictMode>
      );
    })
    .catch(LogError);
}
