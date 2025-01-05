import AppSidebar from "#/components/app-sidebar/app-sidebar";
import { SidebarProvider } from "#/components/ui/sidebar";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main className="p-2 w-full">
          <Outlet />
        </main>
      </SidebarProvider>
      <TanStackRouterDevtools />
    </>
  ),
});
