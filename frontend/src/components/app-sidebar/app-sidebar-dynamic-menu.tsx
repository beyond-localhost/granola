import { Link } from "@tanstack/react-router";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "../ui/sidebar";

import { useAppSidebar } from "./app-sidebar-provider";

export function AppSidebarDynamicMenu() {
  const { bowls } = useAppSidebar();
  return (
    <SidebarMenu>
      {bowls.map((bowl) => {
        return (
          <SidebarMenuItem key={bowl.id}>
            <AppSidebarDynamicMenuItem id={bowl.id} name={bowl.name} />
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

function AppSidebarDynamicMenuItem({ id, name }: { id: number; name: string }) {
  return (
    <SidebarMenuButton asChild>
      <Link
        to="/bowls/$bowlId"
        params={{ bowlId: id.toString() }}
        className="w-full"
        activeProps={{
          className: "text-red-500 font-bold",
        }}
      >
        <span>{name}</span>
      </Link>
    </SidebarMenuButton>
  );
}

export function AppSidebarDynamicMenuFallback() {
  return (
    <SidebarMenu>
      <SidebarMenuSkeleton />
      <SidebarMenuSkeleton />
      <SidebarMenuSkeleton />
      <SidebarMenuSkeleton />
    </SidebarMenu>
  );
}
