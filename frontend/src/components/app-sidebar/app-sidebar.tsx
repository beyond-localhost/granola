import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "#/components/ui/sidebar";
import { Home, Plus } from "lucide-react";

import { Link } from "@tanstack/react-router";

import { Route as indexRoute } from "#/routes/index";
import { AppSidebarDynamicMenu } from "./app-sidebar-dynamic-menu";

function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to={indexRoute.to} preload="viewport">
                    <Home />
                    Home
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Bowls</SidebarGroupLabel>
          <SidebarGroupAction asChild>
            <Link to="/bowls/add">
              <Plus />
            </Link>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <AppSidebarDynamicMenu />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuButton asChild>
          <Link to="/calendar">temp-calendar</Link>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
