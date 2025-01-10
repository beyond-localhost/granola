import * as React from "react";
import { assert } from "./assert";
import * as model from "@/go/models";
import * as todosService from "@/go/todos/TodosService";

type Todo = model.todos.TodoWithFlakeName;

// The key of backing store
type DateKey =
  `${number}${number}${number}${number}-${number}${number}-${number}${number}`;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const predicateDateKey = (v: string): v is DateKey => DATE_REGEX.test(v);

const toDateKey = (d: Date): DateKey => {
  const ret = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
  assert(predicateDateKey(ret), `the ${ret} is not YYYY-MM-DD format`);
  return ret;
};

const dateInRange = (target: Date, start: Date, end: Date): boolean => {
  return target >= start && target <= end;
};

class TodoStore {
  /**
   * note that every insertion occurs, the backed array will be sorted via elements' id
   */
  private readonly m: Map<DateKey, Todo[]> = new Map();

  static from = (todos: Todo[] = []): TodoStore => {
    const s = new TodoStore();
    for (const t of todos) {
      s.insert(t.scheduledAt, t);
    }
    return s;
  };

  get(date: Date): Todo[] {
    return this.m.get(toDateKey(date)) || [];
  }

  insert(date: Date, data: Todo[]): void;
  insert(date: Date, data: Todo): void;
  insert(date: Date, data: Todo | Todo[]): void {
    const key = toDateKey(date);
    if (this.m.get(key) == null) this.m.set(key, []);
    const list = this.m.get(key)!;
    if (Array.isArray(data)) {
      for (const todo of data) {
        list.push(todo);
        list.sort((a, b) => a.id - b.id);
      }
    } else {
      list.push(data);
      list.sort((a, b) => a.id - b.id);
    }
  }

  done(date: Date, id: number) {
    const key = toDateKey(date);
    const arr = this.m.get(key);
    assert(Array.isArray(arr), `There is no backing array on key: ${key}`);
    const idx = arr.findIndex((v) => v.id === id);
    assert(idx !== -1, `There is no entity of ${id} on backing array: ${arr}`);
    arr[idx].done = !arr[idx].done;
  }
  remove(date: Date, id: number) {
    const key = toDateKey(date);
    const arr = this.m.get(key);
    assert(Array.isArray(arr), `There is no backing array on key: ${key}`);
    const idx = arr.findIndex((v) => v.id === id);
    if (idx === -1) {
      return;
    }
    arr.splice(idx, 1);
  }
}

const CurrentDateContext = React.createContext<
  | {
      currentDate: Date;
      prev: (base: Date, offset: number) => void;
      next: (base: Date, offset: number) => void;
    }
  | undefined
>(undefined);

function useCurrentDateContext() {
  const ctx = React.use(CurrentDateContext);
  if (ctx == undefined) {
    throw new Error(
      "useCurrentDateContext should be called within CalendarProvider"
    );
  }
  return ctx;
}

const TodoAPIContext = React.createContext<
  | {
      addTodo: (when: Date, flakeId: number) => Promise<void>;
      removeTodo: (when: Date, todoId: number) => Promise<void>;
      setDone: (when: Date, todoId: number) => Promise<void>;
    }
  | undefined
>(undefined);

function useTodoAPIContext() {
  const ctx = React.use(TodoAPIContext);
  if (ctx == undefined) {
    throw new Error(
      "useTodoAPIContext should be called within CalendarProvider"
    );
  }
  return ctx;
}

type CalendarCell = {
  meta: {
    year: number;
    month: number;
    date: number;
    day: number;
    monthStatus: "prev" | "next" | "current";
  };
  key: string;
  todos: Todo[];
};

type CalenderWeekSnapshot = Array<CalendarCell>;

const CalendarGridContext = React.createContext<
  CalenderWeekSnapshot[] | undefined
>(undefined);

function useCalendarGridContext() {
  const ctx = React.use(CalendarGridContext);
  if (ctx == undefined) {
    throw new Error(
      "useCalendarGridContext should be called within CalendarProvider"
    );
  }
  return ctx;
}

type Props = {
  initialData?: Todo[];
  initialDate?: Date;
  children: React.ReactNode;
};

function CalendarProvider({ initialData, initialDate, children }: Props) {
  const store = React.useRef(TodoStore.from(initialData)).current;
  const [currentDate, setCurrentDate] = React.useState(
    () => initialDate || new Date()
  );
  const [, forceUpdate] = React.useState({});

  const gridStart = React.useMemo(() => {
    const first = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const start = new Date(first);
    start.setDate(start.getDate() - first.getDay());

    return start;
  }, [currentDate]);

  const gridEnd = React.useMemo(() => {
    const last = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
    const end = new Date(last);
    end.setDate(end.getDate() + (6 - last.getDay()));

    return end;
  }, [currentDate]);

  const grid = React.useMemo<CalenderWeekSnapshot[]>(() => {
    const ret: Array<CalenderWeekSnapshot> = [];
    const cur = new Date(gridStart);

    for (let row = 0; row < 6; row++) {
      const week: CalenderWeekSnapshot = [];

      for (let col = 0; col < 7; col++) {
        const status: "prev" | "next" | "current" =
          cur.getMonth() === currentDate.getMonth()
            ? "current"
            : cur < currentDate
              ? "prev"
              : "next";
        const todos = store.get(cur);

        const meta = {
          year: cur.getFullYear(),
          month: cur.getMonth() + 1,
          date: cur.getDate(),
          day: cur.getDay(),
          monthStatus: status,
        };

        const key = [meta.year, meta.month, meta.date, meta.monthStatus].join(
          "-"
        );

        week.push({ todos, meta, key });
        cur.setDate(cur.getDate() + 1);
      }

      ret.push(week);
    }

    return ret;
  }, [currentDate, gridStart, gridEnd]);

  const onPrev = React.useCallback(async (base: Date, offset: number) => {
    const from = new Date(base);
    from.setMonth(from.getMonth() - offset);
    const toSlice = new Date(base);
    const ret = await todosService.GetAllByRange(
      from.toISOString(),
      toSlice.toISOString()
    );
    for (const todo of ret) {
      store.insert(todo.scheduledAt, todo);
    }

    setCurrentDate((prev) => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() - 1);
      return next;
    });
  }, []);

  const onNext = React.useCallback(async (base: Date, offset: number) => {
    const to = new Date(base);
    to.setMonth(to.getMonth() + offset);
    const fromSlice = new Date(base);
    const ret = await todosService.GetAllByRange(
      fromSlice.toISOString(),
      to.toString()
    );
    for (const todo of ret) {
      store.insert(todo.scheduledAt, todo);
    }

    setCurrentDate((prev) => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() + 1);
      return next;
    });
  }, []);

  const addTodo = React.useCallback(
    async (targetDate: Date, flakeId: number) => {
      const createdTodo = await todosService.Create(
        flakeId,
        targetDate.toISOString()
      );
      store.insert(targetDate, createdTodo);
      if (!dateInRange(targetDate, gridStart, gridEnd)) {
        return;
      }
      forceUpdate({});
    },
    [store, gridStart, gridEnd]
  );

  const removeTodo = React.useCallback(
    async (targetDate: Date, todoId: number) => {
      await todosService.Remove(todoId);
      store.remove(targetDate, todoId);

      if (!dateInRange(targetDate, gridStart, gridEnd)) {
        return;
      }
      forceUpdate({});
    },
    [store, gridStart, gridEnd]
  );

  const setDone = React.useCallback(
    async (date: Date, todoId: number) => {
      await todosService.SetDone(todoId);
      store.done(date, todoId);

      if (!dateInRange(date, gridStart, gridEnd)) {
        return;
      }
      forceUpdate({});
    },
    [store, gridStart, gridEnd]
  );

  const currentDateContextValue = React.useMemo(() => {
    return { currentDate, prev: onPrev, next: onNext };
  }, [currentDate, onPrev, onNext]);

  const todoAPIContextValue = React.useMemo(() => {
    return {
      addTodo,
      removeTodo,
      setDone,
    };
  }, [addTodo, removeTodo, setDone]);

  return (
    <CurrentDateContext.Provider value={currentDateContextValue}>
      <TodoAPIContext.Provider value={todoAPIContextValue}>
        <CalendarGridContext.Provider value={grid}>
          {children}
        </CalendarGridContext.Provider>
      </TodoAPIContext.Provider>
    </CurrentDateContext.Provider>
  );
}

export { CalendarProvider, useCalendarGridContext, useCurrentDateContext };
export type { CalendarCell };
