import * as React from "react";

import {
  useCalendarGridContext,
  useCurrentDateContext,
  type CalendarCell,
} from "#/lib/todo-calendar";

import { cn } from "#/lib/utils";
import { toDateKey, useFlakeContext, useTodoContext } from "#/lib/state";
import { assert } from "#/lib/assert";
import { todos } from "@/go/models";
import * as todosService from "@/go/todos/TodosService";
import {
  ChevronLeft,
  ChevronRight,
  Trash2,
  CircleCheck,
  Undo2,
} from "lucide-react";
import { useGlobalOutletSetter } from "#/components/portal";
import { CREATE_TODO_ID, CreateTodo } from "../create-todo/create-todo";
import { debounce } from "#/lib/debounce";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "#/components/ui/context-menu";

function CalendarHeader() {
  const { next, prev, currentDate, now } = useCurrentDateContext();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  return (
    <div className="w-full border-b border-b-zinc-300 pt-3 h-[84px]">
      <div className="flex justify-between items-center select-none cursor-default px-3">
        <h1 className="text-3xl font-bold select-none cursor-default">
          {year}년 {month}월
        </h1>
        <div>
          <div className="flex items-center gap-1">
            <button
              className="border border-zinc-200 rounded-sm p-px"
              onClick={() => prev()}
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
            <button
              className="border border-zinc-200 rounded-sm py-px px-2 text-xs leading-[18px]"
              onClick={() => now()}
            >
              오늘
            </button>
            <button
              className="border border-zinc-200 rounded-sm p-px"
              onClick={() => next()}
            >
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
      <div className="mt-2">
        <CalendarDays />
      </div>
    </div>
  );
}

function CalendarDays() {
  return (
    <div className="grid grid-cols-7 select-none cursor-default *:select-none *:cursor-default *:text-md *:font-light *:text-right *:pr-2">
      <div className="text-zinc-500">일</div>
      <div>월</div>
      <div>화</div>
      <div>수</div>
      <div>목</div>
      <div>금</div>
      <div className="text-zinc-500">토</div>
    </div>
  );
}

function CalendarBody() {
  const grid = useCalendarGridContext();
  return (
    <div className="grid grid-cols-7 grid-rows-6 justify-items-end h-[calc(100%-84px)]">
      {grid.map((week, rowIndex, { length: rowLength }) => {
        return (
          <React.Fragment key={rowIndex}>
            {week.map((date, columnIndex, { length: columnLength }) => {
              return (
                <div
                  key={date.key}
                  className={cn(
                    "w-full border-l border-b select-none cursor-default p-px",
                    {
                      "border-l-0": columnIndex % columnLength === 0,
                      "border-b-0": rowIndex + 1 === rowLength,
                      "bg-zinc-100/90": date.day === 0 || date.day === 6,
                    }
                  )}
                >
                  <CalendarCell cell={date} />
                </div>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function CalendarCell({ cell }: { cell: CalendarCell }) {
  const today = React.useRef(new Date()).current;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const itemAreaRef = React.useRef<HTMLUListElement>(null);
  const todoList = useTodoContext((state) => {
    return state.map.get(cell.key) || [];
  });

  const currentDateKey = toDateKey(today);
  const sameDay = currentDateKey === cell.key;
  const setter = useGlobalOutletSetter();

  const [renderThreshold, setRenderThreshold] = React.useState(todoList.length);

  const calculateThreshold = React.useCallback(() => {
    const itemArea = itemAreaRef.current;
    const container = containerRef.current;

    if (!itemArea || !container) return;

    const offset = 24;

    const containerVisibleHeight = container.clientHeight - offset;
    const itemAreaFullHeight = itemArea.scrollHeight;

    const isOverflowing = itemAreaFullHeight > containerVisibleHeight;

    if (!isOverflowing) {
      setRenderThreshold(todoList.length);
    } else {
      setRenderThreshold(Math.min(2, todoList.length));
    }
  }, [todoList.length]);

  React.useEffect(() => {
    calculateThreshold();
  }, [calculateThreshold]);

  React.useEffect(() => {
    const handleResize = debounce(calculateThreshold, 200);
    window.addEventListener("resize", handleResize);
    return () => {
      handleResize.cancel();
      window.removeEventListener("resize", handleResize);
    };
  }, [calculateThreshold]);

  function onDoubleClick() {
    setter.append(
      CREATE_TODO_ID,
      <CreateTodo
        initialDate={cell.rawDate}
        onClose={() => setter.remove(CREATE_TODO_ID)}
      />
    );
  }

  return (
    <div
      className="h-full cursor-pointer flex flex-col gap-px hover"
      onDoubleClick={onDoubleClick}
      ref={containerRef}
    >
      <p
        className={cn("text-right pr-1 text-md", {
          "text-neutral-400": cell.monthStatus !== "current",
          "text-neutral-500":
            cell.monthStatus === "current" &&
            (cell.day === 0 || cell.day === 6),
          "flex gap-[2px] items-center justify-end": sameDay,
        })}
      >
        {cell.date === 1 ? `${cell.month}월 ` : null}
        <span
          className={cn(
            sameDay
              ? "bg-pink-600 rounded-full w-7 h-7 flex justify-center items-center text-white"
              : ""
          )}
        >
          {cell.date}
        </span>
        <span>일</span>
      </p>
      <ul ref={itemAreaRef} className="grow relative overflow-hidden">
        {todoList.slice(0, renderThreshold).map((todo) => {
          return (
            <li key={todo.id} className="mt-[2px]">
              <TodoItem todo={todo} />
            </li>
          );
        })}
        {renderThreshold < todoList.length && (
          <li className="text-center text-sm text-blue-500 absolute bottom-0 left-0 w-full h-[24px] bg-white">
            {todoList.length - renderThreshold}개 더 보기
          </li>
        )}
      </ul>
    </div>
  );
}

function TodoItem({ todo }: { todo: todos.Todo }) {
  const flake = useFlakeContext((state) => {
    const flake = state.map.get(todo.flakeId);
    assert(flake != undefined, `Flake should not be nullish`);
    return flake;
  });

  const setDone = useTodoContext((state) => state.setDone);
  const removeTodo = useTodoContext((state) => state.remove);

  const onDeleteSelect = async () => {
    await todosService.Remove(todo.id);
    removeTodo(todo);
  };

  const onDoneSelect = async () => {
    await todosService.SetDone(todo.id);
    setDone(todo);
  };
  const doneIcon = todo.done ? <Undo2 /> : <CircleCheck />;
  const doneDisplayMessage = todo.done ? "되돌리기" : "완료하기";

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="px-1 w-full">
          <p className="text-sm truncate">{flake.name}</p>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onSelect={onDeleteSelect}>
          <Trash2 />
          <span className="ml-2">삭제</span>
        </ContextMenuItem>
        <ContextMenuItem onSelect={onDoneSelect}>
          {doneIcon}
          <span className="ml-2">{doneDisplayMessage}</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export { CalendarDays, CalendarHeader, CalendarBody };
