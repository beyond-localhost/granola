import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "#/components/ui/sidebar";
import { Home, CircleCheck } from "lucide-react";

import { Link } from "@tanstack/react-router";

import { Route as indexRoute } from "#/routes/index";
import { Route as bowlsRoute } from "#/routes/bowls/route";

const MENUS = [
  {
    id: 0,
    name: "Home",
    icon: Home,
    to: indexRoute.to,
  },
  {
    id: 1,
    name: "Categories",
    icon: CircleCheck,
    to: "/bowls/",
  },
];

function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            {MENUS.map((menu) => {
              const IconComp = menu.icon;
              return (
                <SidebarMenu key={menu.id}>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to={menu.to}>
                        <IconComp />
                        {menu.name}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              );
            })}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

export default AppSidebar;
