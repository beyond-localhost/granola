import AppSidebar from "#/components/app-sidebar/app-sidebar";
import { SidebarProvider } from "#/components/ui/sidebar";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

// createRootRouteWithContext<TContext>
// @see https://tanstack.com/router/latest/docs/framework/react/guide/router-context
export const Route = createRootRoute({
  component: () => (
    <>
      <SidebarProvider>
        <AppSidebar />
        <Outlet />
      </SidebarProvider>
      <TanStackRouterDevtools />
    </>
  ),
});
