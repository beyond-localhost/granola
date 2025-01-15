import * as React from "react";

import { useBowlContext, useFlakeContext, useTodoContext } from "#/lib/state";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#/components/ui/table";

import { bowls, flakes } from "@/go/models";

import * as flakesService from "@/go/flakes/FlakeService";
import { Button } from "#/components/ui/button";
import { Popover, PopoverContent } from "#/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import { assert } from "#/lib/assert";
import { MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";

type FlakeColumn = flakes.Flake & { bowlName: string };
const flakeColumns: ColumnDef<FlakeColumn>[] = [
  {
    accessorKey: "name",
    header: "이름",
  },
  {
    accessorKey: "description",
    header: "설명",
  },
  {
    accessorKey: "bowlName",
    header: "주제",
  },
  {
    id: "actions",
    cell: () => <MoreHorizontal />,
  },
];

function FlakeList() {
  const bowls = useBowlContext((state) => state.map);
  const flakes = useFlakeContext((state) => state.map);
  const data = React.useMemo<FlakeColumn[]>(() => {
    return Array.from(flakes.values()).map((flake) => {
      const bowl = bowls.get(flake.bowlId);
      // assert(bowl !== undefined, `bowl must be defined`);
      return { ...flake, bowlName: bowl?.name ?? "알 수 없음" };
    });
  }, [bowls, flakes]);

  const removeFlake = useFlakeContext((state) => state.remove);
  const removeTodoByFlakeId = useTodoContext((state) => state.removeByFlakeId);

  const onRemoveFlakeClick = (flake: flakes.Flake) => async () => {
    await flakesService.DeleteById(flake.id);

    removeTodoByFlakeId(flake.id);
    removeFlake(flake.id);
  };

  const t = useReactTable({
    data: data,
    columns: flakeColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <h2 className="text-2xl font-bold">재밌는 일 목록</h2>
      <div className="mt-4 h-[220px] max-h-[220px] overflow-y-auto">
        <Table className="overflow-y-auto border-zinc-200">
          <TableHeader>
            {t.getHeaderGroups().map((headerGroup) => {
              return (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableHeader>
          <TableBody>
            {t.getRowModel().rows.length > 0 ? (
              t.getRowModel().rows.map((row) => {
                const flake = row.original;
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const isLast =
                        cell.column.getIndex() === flakeColumns.length - 1;

                      const cellNode = flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      );

                      return (
                        <TableCell key={cell.id}>
                          {isLast ? (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="ghost">
                                  {cellNode}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="center">
                                <DropdownMenuLabel>
                                  <span className="select-none cursor-default">
                                    추가 액션
                                  </span>
                                </DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={onRemoveFlakeClick(flake)}
                                >
                                  <Trash2 />
                                  <span className="ml-px select-none cursor-pointer">
                                    이 덩어리 삭제
                                  </span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : (
                            cellNode
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={flakeColumns.length}>
                  무엇이든 등록해보는게 어때요?
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <CreateFlakeCTA bowls={Array.from(bowls.values())} />
        <div className="flex gap-1 mt-2">
          <Button
            onClick={() => t.previousPage()}
            size="sm"
            disabled={!t.getCanPreviousPage()}
          >
            이전
          </Button>
          <Button
            onClick={() => t.nextPage()}
            size="sm"
            disabled={!t.getCanNextPage()}
          >
            다음
          </Button>
        </div>
      </div>
    </div>
  );
}

type CreateFlakeCTAProps = {
  bowls: bowls.Bowl[];
};
function CreateFlakeCTA({ bowls }: CreateFlakeCTAProps) {
  const [open, setOpen] = React.useState(false);
  const [pending, startTransition] = React.useTransition();
  const addFlake = useFlakeContext((state) => state.add);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    startTransition(() => {
      const formData = new FormData(event.currentTarget);
      const flakeName = formData.get("flakeName");
      const flakeDescription = formData.get("flakeDescription") || "";
      let bowlId: FormDataEntryValue | number = formData.get("bowlId") || "";

      assert(
        typeof bowlId === "string",
        `bowlId must be a string but got ${typeof bowlId}`
      );

      bowlId = Number.parseInt(bowlId, 10);
      assert(Number.isNaN(bowlId) === false, `bowlId must be a valid number`);

      assert(
        typeof flakeName === "string" && flakeName.length <= 20,
        `bowlName must be a string with length <= 20`
      );
      assert(
        typeof flakeDescription === "string",
        `bowlDescription must be a string`
      );

      flakesService
        .Create(flakeName, flakeDescription, bowlId)
        .then(addFlake)
        .then(() => setOpen(false));
    });
  };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button variant="default" className="mt-2">
          새로운 일 추가
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" side="right" sideOffset={4}>
        <form onSubmit={onSubmit}>
          <fieldset>
            <div className="flex flex-col gap-1">
              <label htmlFor="bowlId">주제</label>
              <select id="bowlId" name="bowlId">
                {bowls.map((bowl) => {
                  return (
                    <option key={bowl.id} value={bowl.id}>
                      {bowl.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="flex flex-col gap-1 mt-2">
              <label htmlFor="flakeName">이름</label>
              <Input
                required
                maxLength={20}
                name="flakeName"
                id="flakeName"
                placeholder="20자 이내"
              />
            </div>
            <div className="flex flex-col gap-1 mt-2">
              <label htmlFor="flakeDescription">설명</label>
              <Textarea
                name="flakeDescription"
                id="flakeDescription"
                placeholder="간단한 설명을 적어보아요 (선택사항)"
                className="resize-none"
              />
            </div>
          </fieldset>
          <div className="flex justify-end mt-2 gap-2">
            <Button
              type="reset"
              size="sm"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              취소
            </Button>
            <Button
              type="submit"
              size="sm"
              variant="default"
              className="bg-pink-700/90 transition-colors"
              disabled={pending}
            >
              추가
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}

export { FlakeList };
