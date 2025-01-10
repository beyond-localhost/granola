import { createFileRoute } from "@tanstack/react-router";
import { CalendarBody, CalendarHeader } from "./-components/calendar/calendar";
import { CalendarProvider } from "#/lib/todo-calendar";
import * as todosService from "@/go/todos/TodosService";

export const Route = createFileRoute("/calendar")({
  component: RouteComponent,
  loader: async () => {
    const currentDate = new Date();
    const nextMonthDate = new Date(currentDate);
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
    const prevMonthDate = new Date(currentDate);
    prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
    return await todosService.GetAllByRange(
      prevMonthDate.toISOString(),
      nextMonthDate.toISOString()
    );
  },
});

function RouteComponent() {
  const initialData = Route.useLoaderData();
  return (
    <CalendarProvider initialData={initialData}>
      <div className="w-full h-screen">
        <CalendarHeader />
        <CalendarBody />
      </div>
    </CalendarProvider>
  );
}
