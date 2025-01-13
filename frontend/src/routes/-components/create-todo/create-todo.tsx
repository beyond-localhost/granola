import * as React from "react";
import ReactDOM from "react-dom";
import { Transition, TransitionChild } from "@headlessui/react";
import { useScrollLock } from "#/lib/scroll-lock";
import { cn } from "#/lib/utils";
import {
  toDateKey,
  useBowlContext,
  useFlakeContext,
  useTodoContext,
} from "#/lib/state";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "#/components/ui/popover";
import { Button } from "#/components/ui/button";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "#/components/ui/command";

import { bowls, flakes, todos } from "@/go/models";
import * as todosService from "@/go/todos/TodosService";
import { assert } from "#/lib/assert";
import { Calendar } from "#/components/ui/calendar";
import { LogDebug } from "@/runtime/runtime";

type CreateTodoProps = {
  onClose: () => void;
  initialDate?: Date;
};

function CreateTodo({ onClose, initialDate }: CreateTodoProps) {
  const [open, setOpen] = React.useState(true);
  const [bowl, setBowl] = React.useState<bowls.Bowl>();
  const [flake, setFlake] = React.useState<flakes.Flake>();
  const [date, setDate] = React.useState<Date>(() => initialDate || new Date());

  const addTodo = useTodoContext((state) => state.add);

  const createTodo = async () => {
    assert(
      flake != undefined,
      `The flake is undefined but createTodo is triggered`
    );
    assert(
      date != undefined,
      `The date is undefined but createTodo is triggered`
    );
    try {
      const iso = date.toISOString();
      LogDebug(`<FRONTEND> the iso string is ${iso}`);
      const newTodo = todos.Todo.createFrom(
        await todosService.Create(flake?.id, iso)
      );
      LogDebug(`<FRONTEND> new todo is : ${JSON.stringify(newTodo, null, 4)}`);
      addTodo(newTodo);
      setOpen(false);
    } catch (e) {
      if (typeof e === "string") {
        LogDebug(`<FRONTEND> There is an exception. ${e}`);
      } else if (e instanceof Error) {
        LogDebug(`<FRONTEND> There is an exception. ${e.message}`);
      } else {
        LogDebug(`<FRONTEND> There is an exception. ${String(e)}`);
      }
      throw e;
    }
  };

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return ReactDOM.createPortal(
    <DialogRoot open={open}>
      <Transition show={open} appear={true} afterLeave={onClose}>
        <TransitionChild>
          <div
            onClick={() => setOpen(false)}
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
              {date == undefined ? null : (
                <SelectDate
                  key={date.toString()}
                  currentDate={date}
                  setCurrentDate={setDate}
                />
              )}
              <div className="mt-6">
                <SelectBowl
                  currentBowl={bowl}
                  setBowl={(nextBowl) => {
                    setFlake(undefined);
                    setBowl(nextBowl);
                  }}
                />
              </div>
              {bowl == undefined ? null : (
                <div className="mt-6">
                  <SelectFlake
                    key={bowl.id}
                    currentFlake={flake}
                    setFlake={(nextFlake) => {
                      setFlake(nextFlake);
                    }}
                    currentBowlId={bowl.id}
                  />
                </div>
              )}
            </div>
            <div className="absolute bottom-6 right-6 flex gap-4">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                취소
              </Button>
              <Button
                variant="default"
                className="bg-pink-700/90 transition-colors"
                disabled={typeof flake == undefined || date == undefined}
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
  );
}

function DialogRoot(props: React.PropsWithChildren<{ open: boolean }>) {
  useScrollLock({ open: props.open });
  return (
    <div className="fixed inset-0 isolate w-full z-20">{props.children}</div>
  );
}

function SelectBowl({
  currentBowl,
  setBowl,
}: {
  currentBowl?: bowls.Bowl;
  setBowl: (bowl: bowls.Bowl) => void;
}) {
  const bowls = useBowlContext((state) => Array.from(state.map.values()));
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <p className="font-bold my-2 text-xl">주제 정하기</p>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[200px] bg-neutral-100/10 justify-between border-none text-neutral-900 hover:bg-pink-400/30"
        >
          {currentBowl ? currentBowl.name : "주제를 정해주세요"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput />
          <CommandList>
            {bowls.map((bowl) => {
              return (
                <CommandItem
                  key={bowl.id}
                  onSelect={() => {
                    setBowl(bowl);
                    setOpen(false);
                  }}
                >
                  {bowl.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      bowl.id === currentBowl?.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function SelectFlake({
  currentBowlId,
  currentFlake,
  setFlake,
}: {
  currentBowlId: number;
  currentFlake?: flakes.Flake;
  setFlake: (flake: flakes.Flake) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const flakes = useFlakeContext((state) => {
    return Array.from(state.map.values()).filter(
      (flake) => flake.bowlId === currentBowlId
    );
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <p className="font-bold my-2 text-xl">내용 정하기</p>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[200px] bg-neutral-100/10 justify-between border-none text-neutral-900 hover:bg-pink-400/30"
        >
          {currentFlake ? currentFlake.name : "내용을 정해주세요"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput />
          <CommandList>
            {flakes.map((flake) => {
              return (
                <CommandItem
                  key={flake.id}
                  onSelect={() => {
                    setFlake(flake);
                    setOpen(false);
                  }}
                >
                  {flake.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      flake.id === currentFlake?.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function SelectDate({
  currentDate,
  setCurrentDate,
}: {
  currentDate: Date | undefined;
  setCurrentDate: (nextDate: Date) => void;
}) {
  return (
    <Popover>
      <p className="font-bold my-2 text-xl">날짜 정하기</p>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="bg-neutral-100/10 justify-between border-none text-neutral-900 hover:bg-pink-400/30"
        >
          <CalendarIcon />
          {currentDate == undefined
            ? "날짜를 정해주세요"
            : toDateKey(currentDate)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-o" align="start">
        <Calendar
          mode="single"
          selected={currentDate}
          onSelect={(_, selectedDate) => {
            LogDebug(
              `<FRONTEND> Calendar selected: ${selectedDate.toString()}`
            );
            setCurrentDate(selectedDate);
          }}
          required
        />
      </PopoverContent>
    </Popover>
  );
}

const CREATE_TODO_ID = "create-todo";

export { CreateTodo, CREATE_TODO_ID };
