import * as React from "react";
import {
  useCalendarGridContext,
  useCurrentDateContext,
  type CalendarCell,
} from "#/lib/todo-calendar";

import { cn } from "#/lib/utils";

function CalendarHeader() {
  const { next, prev, currentDate } = useCurrentDateContext();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  return (
    <div className="w-full h-[80px] border-b border-b-zinc-300">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {year}년 {month}월
        </h1>
        <div>
          <button onClick={() => prev(currentDate, 3)}>이전달</button>
          <button onClick={() => next(currentDate, 3)}>다음달</button>
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
    <div className="grid grid-cols-7 justify-items-end *:bg-sky-500">
      <div>일</div>
      <div>월</div>
      <div>화</div>
      <div>수</div>
      <div>목</div>
      <div>금</div>
      <div>토</div>
    </div>
  );
}

function CalendarBody() {
  const grid = useCalendarGridContext();
  return (
    <div className="grid grid-cols-7 grid-rows-6 justify-items-end h-[calc(100%-80px)]">
      {grid.map((week, rowIndex, { length: rowLength }) => {
        return (
          <React.Fragment key={rowIndex}>
            {week.map((date, columnIndex, { length: columnLength }) => {
              return (
                <div
                  key={date.key}
                  className={cn("w-full border-l border-b", {
                    "border-l-0": columnIndex % columnLength === 0,
                    "border-b-0": rowIndex + 1 === rowLength,
                  })}
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
  return (
    <div>
      <span>{cell.meta.date}일</span>
      <ul>
        {cell.todos.map((todo) => {
          return <li key={todo.id}>{todo.flakeName}</li>;
        })}
      </ul>
    </div>
  );
}

export { CalendarDays, CalendarHeader, CalendarBody };
