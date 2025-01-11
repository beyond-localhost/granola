import { Link } from "@tanstack/react-router";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

import { useBowlContext } from "#/lib/state";

export function AppSidebarDynamicMenu() {
  const bowlMap = useBowlContext((state) => state.map);
  const bowls = Array.from(bowlMap);
  return (
    <SidebarMenu>
      {bowls.map(([bowlId, bowl]) => {
        return (
          <SidebarMenuItem key={bowlId}>
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
