import * as React from "react"
import * as ReactDOM from "react-dom"
import {
  type ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
} from "@tanstack/react-table"
import { PopoverTrigger } from "@radix-ui/react-popover"
import { MoreHorizontal, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useBowlContext, useFlakeContext, useTodoContext } from "#/lib/state"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#/components/ui/table"
import { type bowls } from "@/go/models"
import * as bowlsService from "@/go/bowls/BowlsService"
import { Button } from "#/components/ui/button"
import { Popover, PopoverContent } from "#/components/ui/popover"
import { Input } from "#/components/ui/input"
import { Textarea } from "#/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu"
import { CreateBowl } from "#/domain/bowl/schema"

const bowlColumns: ColumnDef<bowls.Bowl>[] = [
  {
    accessorKey: "name",
    header: "이름",
  },
  {
    accessorKey: "description",
    header: "설명",
  },
  {
    id: "actions",
    cell: () => <MoreHorizontal />,
  },
]

function BowlList() {
  const bowls = useBowlContext((state) => {
    return Array.from(state.map).map(([_, bowl]) => bowl)
  })
  const removeBowl = useBowlContext((state) => state.remove)

  const flakes = useFlakeContext((state) => state.map)
  const removeFlakeByBowlId = useFlakeContext((state) => state.removeByBowlId)
  const removeTodoByFlakeId = useTodoContext((state) => state.removeByFlakeId)

  const onRemoveBowlClick = (bowl: bowls.Bowl) => async () => {
    try {
      await bowlsService.DeleteById(bowl.id)
    } catch (reason: unknown) {
      toast.error(`주제를 삭제하는데 실패했습니다. ${String(reason)}`, {
        className: "text-red-500",
      })
    }

    const filteredFlakes = Array.from(flakes).filter(
      ([_, flake]) => flake.bowlId === bowl.id
    )
    for (const [_, flake] of filteredFlakes) {
      ReactDOM.flushSync(() => {
        removeTodoByFlakeId(flake.id)
        removeFlakeByBowlId(bowl.id)
      })
    }
    removeBowl(bowl.id)
  }

  const t = useReactTable({
    data: bowls,
    columns: bowlColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div>
      <h2 className="text-2xl font-bold">주제 목록</h2>
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
                    )
                  })}
                </TableRow>
              )
            })}
          </TableHeader>
          <TableBody>
            {t.getRowModel().rows.length > 0 ? (
              t.getRowModel().rows.map((row) => {
                const bowl = row.original
                return (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => {
                      const isLast = cell.column.getIndex() === bowlColumns.length - 1

                      const cellNode = flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )

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
                                <DropdownMenuItem onClick={onRemoveBowlClick(bowl)}>
                                  <Trash2 />
                                  <span className="ml-px select-none cursor-pointer">
                                    이 주제 삭제
                                  </span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : (
                            cellNode
                          )}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={bowlColumns.length}>등록된 주제가 없습니다</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <CreateBowlCTA />
        <div className="flex gap-1">
          <Button
            onClick={() => {
              t.previousPage()
            }}
            size="sm"
            disabled={!t.getCanPreviousPage()}
          >
            이전
          </Button>
          <Button
            onClick={() => {
              t.nextPage()
            }}
            size="sm"
            disabled={!t.getCanNextPage()}
          >
            다음
          </Button>
        </div>
      </div>
    </div>
  )
}

const defaultErrorMap = {
  name: "",
  description: "",
} satisfies Record<keyof CreateBowl, string>

function CreateBowlCTA() {
  const [open, setOpen] = React.useState(false)
  const [pending, startTransition] = React.useTransition()
  const [errorMap, setErrorMap] = React.useState(defaultErrorMap)
  const addBowl = useBowlContext((state) => state.add)

  const onOpenChange = (nextOpen: boolean) => {
    setErrorMap(defaultErrorMap)
    setOpen(nextOpen)
  }

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    setErrorMap(defaultErrorMap)

    startTransition(() => {
      const ret = CreateBowl.safeParse(
        Object.fromEntries(new FormData(event.currentTarget))
      )

      if (!ret.success) {
        const formatted = ret.error.format()
        setErrorMap((prev) => {
          return {
            ...prev,
            name: formatted.name?._errors.join("\n") ?? "",
            description: formatted.description?._errors.join("\n") ?? "",
          }
        })
        return
      }
      const payload = ret.data

      bowlsService
        .Create(payload.name, payload.description)
        .then(addBowl, (reason: unknown) => {
          toast.error(`주제를 저장하는데 실패했습니다. ${String(reason)}`, {
            className: "text-red-500",
          })
        })
        .finally(() => {
          setOpen(false)
        })
    })
  }

  return (
    <Popover onOpenChange={onOpenChange} open={open}>
      <PopoverTrigger asChild>
        <Button variant="default" className="mt-2">
          주제 추가
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" side="right" sideOffset={4}>
        <form onSubmit={onSubmit}>
          <fieldset>
            <div className="flex flex-col gap-1">
              <label htmlFor="name">주제 이름</label>
              <Input
                required
                minLength={1}
                // maxLength={20}
                name="name"
                id="name"
                placeholder="20자 이내"
              />
              {errorMap.name.length > 0 ? (
                <span role="alert" className="text-red-500 text-xs font-medium ml-1 mt-1">
                  {errorMap.name}
                </span>
              ) : null}
            </div>
            <div className="flex flex-col gap-1 mt-2">
              <label htmlFor="description">주제 설명</label>
              <Textarea
                name="description"
                id="description"
                placeholder="간단한 설명을 적어보아요 (선택사항)"
                className="resize-none"
              />
              {errorMap.description.length > 0 ? (
                <span role="alert" className="text-red-500 text-xs font-medium ml-1 mt-1">
                  {errorMap.description}
                </span>
              ) : null}
            </div>
          </fieldset>
          <div className="flex justify-end mt-2 gap-2">
            <Button
              type="reset"
              size="sm"
              variant="outline"
              onClick={() => {
                setOpen(false)
              }}
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
  )
}

export { BowlList }
