import * as React from "react";
import { DateKey, toDateKey } from "./state";

const CurrentDateContext = React.createContext<
  | {
      currentDate: Date;
      prev: () => void;
      next: () => void;
      now: () => void;
    }
  | undefined
>(undefined);

function useCurrentDateContext() {
  const ctx = React.useContext(CurrentDateContext);
  if (ctx == undefined) {
    throw new Error(
      "useCurrentDateContext should be called within CalendarProvider"
    );
  }
  return ctx;
}

type CalendarCell = {
  year: number;
  month: number;
  date: number;
  day: number;

  monthStatus: "prev" | "next" | "current";
  key: DateKey;
  rawDate: Date;
};

type CalenderWeekSnapshot = Array<CalendarCell>;

const CalendarGridContext = React.createContext<
  CalenderWeekSnapshot[] | undefined
>(undefined);

function useCalendarGridContext() {
  const ctx = React.useContext(CalendarGridContext);
  if (ctx == undefined) {
    throw new Error(
      "useCalendarGridContext should be called within CalendarProvider"
    );
  }
  return ctx;
}

type Props = {
  initialDate?: Date;
  children: React.ReactNode;
};

function CalendarProvider({ initialDate, children }: Props) {
  const [currentDate, setCurrentDate] = React.useState(
    () => initialDate || new Date()
  );

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

  const grid = React.useMemo<CalenderWeekSnapshot[]>(() => {
    const ret: Array<CalenderWeekSnapshot> = [];
    const cur = new Date(gridStart);

    for (let row = 0; row < 6; row++) {
      const week: CalenderWeekSnapshot = [];

      for (let col = 0; col < 7; col++) {
        const snapshot = new Date(cur);
        const status: "prev" | "next" | "current" =
          snapshot.getMonth() === currentDate.getMonth()
            ? "current"
            : snapshot < currentDate
              ? "prev"
              : "next";

        const key = toDateKey(snapshot);
        week.push({
          year: snapshot.getFullYear(),
          month: snapshot.getMonth() + 1,
          date: snapshot.getDate(),
          day: snapshot.getDay(),
          monthStatus: status,
          key,
          rawDate: snapshot,
        });
        cur.setDate(cur.getDate() + 1);
      }

      ret.push(week);
    }

    return ret;
  }, [currentDate, gridStart]);

  const onPrev = React.useCallback(async () => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() - 1);
      return next;
    });
  }, []);

  const onNext = React.useCallback(async () => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() + 1);
      return next;
    });
  }, []);

  const onToday = React.useCallback(() => {
    setCurrentDate((prev) => {
      const today = new Date();
      if (toDateKey(today) == toDateKey(prev)) {
        return prev;
      }
      return today;
    });
  }, []);

  const currentDateContextValue = React.useMemo(() => {
    return { currentDate, prev: onPrev, next: onNext, now: onToday };
  }, [currentDate, onPrev, onNext]);

  return (
    <CurrentDateContext.Provider value={currentDateContextValue}>
      <CalendarGridContext.Provider value={grid}>
        {children}
      </CalendarGridContext.Provider>
    </CurrentDateContext.Provider>
  );
}

export { CalendarProvider, useCalendarGridContext, useCurrentDateContext };

export type { CalendarCell };
