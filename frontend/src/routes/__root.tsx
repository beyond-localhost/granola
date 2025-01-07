import AppSidebar from "#/components/app-sidebar/app-sidebar";
import { AppSidebarProvider } from "#/components/app-sidebar/app-sidebar-provider";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <AppSidebarProvider>
        <AppSidebar />
        <main className="p-2 w-full">
          <Outlet />
        </main>
      </AppSidebarProvider>
      <TanStackRouterDevtools />
    </>
  ),
});
