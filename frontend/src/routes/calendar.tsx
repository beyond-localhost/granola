import { createFileRoute } from "@tanstack/react-router";
import { CalendarBody, CalendarHeader } from "./-components/calendar/calendar";
import { CalendarProvider } from "#/lib/todo-calendar";

export const Route = createFileRoute("/calendar")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <CalendarProvider>
      <div className="w-full h-screen">
        <CalendarHeader />
        <CalendarBody />
      </div>
    </CalendarProvider>
  );
}
