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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGlobalOutletSetter } from "#/components/portal";
import { CreateTodo } from "../create-todo/create-todo";
import { LogDebug } from "@/runtime/runtime";

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
  // const [threshold, setThreshold] = React.useState(() => todoList.length);

  const currentDateKey = toDateKey(today);
  const sameDay = currentDateKey === cell.key;
  const setter = useGlobalOutletSetter();

  function onDoubleClick() {
    const id = "create-todo";
    setter.append(
      id,
      <CreateTodo
        initialDate={cell.rawDate}
        onClose={() => setter.remove(id)}
      />
    );
  }

  React.useLayoutEffect(() => {
    const itemArea = itemAreaRef.current;
    const container = containerRef.current;
    if (itemArea == null || container == null) {
      return;
    }
    // LogDebug(`-`.repeat(20));
    LogDebug(
      `
      ${`-`.repeat(20)}
      ItemArea's Scroll height: ${itemArea.scrollHeight}
      ItemArea's Client height: ${itemArea.clientHeight}
      Container's Scroll height: ${container.scrollHeight}
      Container's Client height: ${container.clientHeight}
      ${`-`.repeat(20)}
      `.trim()
    );

    const offset = 24;
    const containerVisibleHeight = container.clientHeight - offset;
    const itemAreaFullHeight = itemArea.scrollHeight; // including overflown items

    // if (containerVisibleHeight <= itemAreaFullHeight) {
    //   const children = Array.from(itemArea.children);
    //   let fullHeight = itemAreaFullHeight;
    //   let lastIdx = children.length; // exclusive

    //   if (children.length === 0) {
    //     return;
    //   }

    //   while (containerVisibleHeight <= fullHeight || fullHeight > 0) {
    //     const last = children[lastIdx - 1];
    //     fullHeight -= last.clientHeight;
    //     lastIdx--;
    //   }

    //   if (fullHeight > 0 && lastIdx > 0) {
    //     setThreshold(lastIdx);
    //   }
    // }

    // if (container.clei)

    // LogDebug(`ItemAreas Scroll width: ${itemArea.scrollWidth}`);
    // LogDebug(`ItemAreas Client height: ${itemArea.clientHeight}`);
    // LogDebug(`-`.repeat(20));
    // LogDebug(`ItemAreas Client width: ${itemArea.clientWidth}`);
  }, []);

  return (
    <div
      className="h-full cursor-pointer flex flex-col gap-px"
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
      <ul ref={itemAreaRef} className="overflow-clip grow">
        {todoList.map((todo) => {
          return (
            <li key={todo.id} className="mt-[2px]">
              <TodoItem todo={todo} />
            </li>
          );
        })}
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

  return (
    <div className="px-1 w-full">
      <p className="text-sm truncate">{flake.name.repeat(10)}</p>
    </div>
  );
}

export { CalendarDays, CalendarHeader, CalendarBody };
