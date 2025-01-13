import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import {
  initialBowlsPromise,
  initialFlakesPromise,
  initialTodosPromise,
} from "#/lib/bootstrap";
import {
  BowlContextProvider,
  FlakeContextProvider,
  TodoContextProvider,
} from "#/lib/state";

import { GlobalOutletProvider, GlobalOutlet } from "#/components/portal";
import { NavigationCommand } from "./-components/navigation-command/navigation-command";

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  return (
    <GlobalOutletProvider>
      <BowlContextProvider initialData={initialBowlsPromise}>
        <FlakeContextProvider initialFlakes={initialFlakesPromise}>
          <TodoContextProvider initialData={initialTodosPromise}>
            <Outlet />
            <GlobalOutlet />
            <NavigationCommand />
            <TanStackRouterDevtools />
          </TodoContextProvider>
        </FlakeContextProvider>
      </BowlContextProvider>
    </GlobalOutletProvider>
  );
}
