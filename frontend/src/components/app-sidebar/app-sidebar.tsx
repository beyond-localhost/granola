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
import { Link } from "@tanstack/react-router";

import { Sprout, Home, CircleCheck } from "lucide-react";

const MENUS = [
  {
    id: 0,
    name: "Home",
    icon: Home,
  },
  {
    id: 1,
    name: "Categories",
    icon: Sprout,
  },
  {
    id: 2,
    name: "Todos",
    icon: CircleCheck,
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
                      <Link to="/">
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
