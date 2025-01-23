import * as React from "react"
import * as ReactDOM from "react-dom"
import { Transition, TransitionChild } from "@headlessui/react"
import { CalendarIcon } from "lucide-react"
import { toast } from "sonner"
import { useScrollLock } from "#/lib/scroll-lock"
import { cn } from "#/lib/utils"
import { useBowlContext } from "#/domain/bowl/store"
import { useFlakeContext } from "#/domain/flake/store"
import { useTodoContext, toDateKey } from "#/domain/todo/store"
import { Popover, PopoverContent, PopoverTrigger } from "#/components/ui/popover"
import { Button } from "#/components/ui/button"
import { type Flake } from "#/domain/flake/schema"
import * as todosService from "@/go/todos/TodosService"
import { assert } from "#/lib/assert"
import { Calendar } from "#/components/ui/calendar"
import { CreateTodo as CreateTodoSchema, Todo } from "#/domain/todo/schema"

type CreateTodoProps = {
  onClose: () => void
  initialDate?: Date
}

function CreateTodo({ onClose, initialDate }: CreateTodoProps) {
  const bowlMap = useBowlContext((state) => state.map)
  const flakeMap = useFlakeContext((state) => state.map)
  const addTodo = useTodoContext((state) => state.upsert)

  const [open, setOpen] = React.useState(true)
  const [date, setDate] = React.useState<Date>(() => initialDate ?? new Date())

  const [targetFlake, setTargetFlake] = React.useState<Flake>()

  const createTodo = async () => {
    assert(
      targetFlake !== undefined,
      `The flake is undefined but createTodo is triggered`
    )

    const zodValidation = CreateTodoSchema.safeParse({
      flakeId: targetFlake.id,
      scheduledAt: date,
    })

    if (zodValidation.error) {
      toast.error(`할 일을 만드는데 실패하였습니다`, { className: "text-red-500 " })
      return
    }

    const payload = zodValidation.data
    try {
      const newTodo = await todosService.Create(
        payload.flakeId,
        payload.scheduledAt.toISOString()
      )

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- zod parse this any to the date
      addTodo(Todo.parse({ ...newTodo, scheduledAt: newTodo.scheduledAt }))
      setOpen(false)
    } catch (error: unknown) {
      toast.error(`할 일을 만드는데 실패하였습니다`, { className: "text-red-500 " })
    }
  }

  const dataList = React.useMemo(() => {
    const flakeList = Array.from(flakeMap.values())
    return flakeList.map((f) => {
      const bowl = bowlMap.get(f.bowlId)
      assert(bowl !== undefined, `The bowl should not be nullish`)
      return {
        flake: f,
        bowl,
      }
    })
  }, [bowlMap, flakeMap])

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault()
        setOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return ReactDOM.createPortal(
    <DialogRoot open={open}>
      <Transition show={open} appear afterLeave={onClose}>
        <TransitionChild>
          <div
            onClick={() => {
              setOpen(false)
            }}
            className={cn(
              "fixed inset-0 w-full bg-gradient-to-t from-pink-200 to-pink-500 transition opacity-50",
              "data-[closed]:opacity-0",
              "date-[enter]:duration-300",
              "data-[leave]:delay-200 duration-200"
            )}
          />
        </TransitionChild>
        <TransitionChild>
          <div
            className={cn(
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-100 transition-transform",
              "w-[80vw] h-[60vh] bg-neutral-50/25 backdrop-blur-lg",
              "border rounded-3xl border-neutral-100/15",
              "p-5",
              "data-[closed]:scale-0",
              "data-[enter]:delay-200 data-[enter]:duration-200",
              "data-[leave]:delay-0 data-[leave]:duration-300"
            )}
          >
            <div>
              <p className="font-bold my-2 text-xl">할 일 선택하기</p>
              <ul className="overflow-y-auto h-[200px] max-h-[200px]">
                {dataList.map(({ bowl, flake }) => {
                  return (
                    <li key={flake.id}>
                      <Button
                        className={cn(
                          "inline-flex w-full justify-start border-b border-b-red-300 rounded-none hover:bg-pink-300/30 transition-colors",
                          {
                            "bg-pink-500/30": targetFlake?.id === flake.id,
                          }
                        )}
                        variant="ghost"
                        onClick={() => {
                          setTargetFlake(flake)
                        }}
                      >
                        <span className="font-bold">{flake.name}</span>
                        <span className="text-slate-600">{bowl.name} 에서 등록함</span>
                      </Button>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className="mt-6">
              <Popover>
                <p className="font-bold my-2 text-xl">날짜 정하기</p>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-neutral-100/10 justify-between border-none text-neutral-900 hover:bg-pink-400/30"
                  >
                    <CalendarIcon />
                    {toDateKey(date)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-o" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(_, selectedDate) => {
                      setDate(selectedDate)
                    }}
                    required
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="absolute bottom-6 right-6 flex gap-4">
              <Button
                variant="ghost"
                onClick={() => {
                  setOpen(false)
                }}
              >
                취소
              </Button>
              <Button
                variant="default"
                className="bg-pink-700/90 transition-colors"
                disabled={targetFlake === undefined}
                onClick={createTodo}
              >
                만들기
              </Button>
            </div>
          </div>
        </TransitionChild>
      </Transition>
    </DialogRoot>,
    document.body
  )
}

function DialogRoot(props: React.PropsWithChildren<{ open: boolean }>) {
  useScrollLock({ open: props.open })
  return <div className="fixed inset-0 isolate w-full z-20">{props.children}</div>
}

const CREATE_TODO_ID = "create-todo"

export { CreateTodo, CREATE_TODO_ID }
