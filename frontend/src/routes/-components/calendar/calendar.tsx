import * as React from "react";
import {
  useCalendarGridContext,
  useCurrentDateContext,
} from "#/lib/todo-calendar";

function CalendarHeader() {
  const { next, prev, currentDate } = useCurrentDateContext();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  return (
    <div className="w-full top-0 h-[80px] border-b pb-2 border-b-zinc-600">
      <h1>
        {year}년 {month}월
      </h1>
      <CalendarDays />
      <button onClick={() => prev(currentDate, 3)}>이전달</button>
      <button onClick={() => next(currentDate, 3)}>다음달</button>
    </div>
  );
}

function CalendarDays() {
  return (
    <div className="grid grid-cols-7 justify-items-end">
      <div className="pr-2">일</div>
      <div className="pr-2">월</div>
      <div className="pr-2">화</div>
      <div className="pr-2">수</div>
      <div className="pr-2">목</div>
      <div className="pr-2">금</div>
      <div className="pr-2">토</div>
    </div>
  );
}

function CalendarBody() {
  const grid = useCalendarGridContext();
  return (
    <div className="grid grid-cols-7 grid-rows-6 h-[calc(100%-80px)]">
      {grid.map((week, index) => {
        return (
          <React.Fragment key={index}>
            {week.map((date) => {
              return (
                <div key={date.key}>
                  <span>{date.meta.date}</span>
                  <ul>
                    {date.todos.map((todo) => {
                      return <li key={todo.id}>{todo.flakeName}</li>;
                    })}
                  </ul>
                </div>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export { CalendarDays, CalendarHeader, CalendarBody };
