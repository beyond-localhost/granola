import * as React from "react"

import { createFileRoute } from "@tanstack/react-router"
import { CalendarBody, CalendarHeader } from "./-components/calendar/calendar"
import { CalendarProvider } from "#/lib/todo-calendar"
import { useGlobalOutletSetter } from "#/components/portal"
import { CREATE_TODO_ID, CreateTodo } from "./-components/create-todo/create-todo"

export const Route = createFileRoute("/calendar")({
  component: RouteComponent,
})

const CREATE_TODO_SHORTCUT = "n"

function RouteComponent() {
  const setter = useGlobalOutletSetter()
  const [setterCalled, setSetterCalled] = React.useState(false)

  React.useEffect(() => {
    if (setterCalled) {
      return
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === CREATE_TODO_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        if (setterCalled) {
          return
        }
        setter.append(
          CREATE_TODO_ID,
          <CreateTodo
            onClose={() => {
              setter.remove(CREATE_TODO_ID)
              setSetterCalled(false)
            }}
          />
        )
        setSetterCalled(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [setter, setterCalled])
  return (
    <CalendarProvider>
      <div className="w-full h-screen">
        <CalendarHeader />
        <CalendarBody />
      </div>
    </CalendarProvider>
  )
}
