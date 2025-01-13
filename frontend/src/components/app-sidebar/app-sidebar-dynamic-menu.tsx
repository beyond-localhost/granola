import ReactDOM from "react-dom";
import { Link } from "@tanstack/react-router";
import {
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { Ellipsis, Trash2 } from "lucide-react";

import { useBowlContext, useFlakeContext, useTodoContext } from "#/lib/state";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import * as bowlsService from "@/go/bowls/BowlsService";

export function AppSidebarDynamicMenu() {
  const bowlMap = useBowlContext((state) => state.map);
  const flakeMap = useFlakeContext((state) => state.map);

  const bowls = Array.from(bowlMap);

  const removeBowl = useBowlContext((state) => state.remove);
  const removeFlakeByBowlId = useFlakeContext((state) => state.removeByBowlId);
  const removeTodoByFlakeId = useTodoContext((state) => state.removeByFlakeId);

  const onSelectRemoveButton = async (bowlId: number) => {
    await bowlsService.DeleteById(bowlId);
    const flakes = Array.from(flakeMap).filter(
      ([_, flake]) => flake.bowlId === bowlId
    );
    flakes.forEach(([flakeId, _]) => {
      ReactDOM.flushSync(() => {
        removeTodoByFlakeId(flakeId);
      });
    });
    removeFlakeByBowlId(bowlId);
    removeBowl(bowlId);
  };

  return (
    <SidebarMenu>
      {bowls.map(([bowlId, bowl]) => {
        return (
          <SidebarMenuItem key={bowlId}>
            <AppSidebarDynamicMenuItem id={bowl.id} name={bowl.name} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction>
                  <Ellipsis />
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start">
                <DropdownMenuItem onSelect={() => onSelectRemoveButton(bowlId)}>
                  <Trash2 />
                  <span>지우기</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
