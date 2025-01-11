import AppSidebar from "#/components/app-sidebar/app-sidebar";

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

import { SidebarProvider } from "#/components/ui/sidebar";
import { GlobalOutletProvider, GlobalOutlet } from "#/components/portal";

export const Route = createRootRoute({
  component: () => (
    <GlobalOutletProvider>
      <BowlContextProvider initialData={initialBowlsPromise}>
        <FlakeContextProvider initialFlakes={initialFlakesPromise}>
          <TodoContextProvider initialData={initialTodosPromise}>
            <SidebarProvider>
              <AppSidebar />
              <main className="w-full">
                <Outlet />
              </main>
            </SidebarProvider>

            <TanStackRouterDevtools />
          </TodoContextProvider>
        </FlakeContextProvider>
      </BowlContextProvider>
      <GlobalOutlet />
    </GlobalOutletProvider>
  ),
});
