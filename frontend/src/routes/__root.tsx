import { createRootRoute, Outlet } from "@tanstack/react-router"
import { Toaster } from "sonner"
import { bootStrapPromise } from "#/lib/bootstrap"
import {
  BowlContextProvider,
  FlakeContextProvider,
  TodoContextProvider,
} from "#/lib/state"
import { GlobalOutletProvider, GlobalOutlet } from "#/components/portal"
import { NavigationCommand } from "./-components/navigation-command/navigation-command"

export const Route = createRootRoute({
  loader: () => bootStrapPromise,
  component: Root,
})

function Root() {
  const [initialBowls, initialFlakes, initialTodos] = Route.useLoaderData()
  return (
    <GlobalOutletProvider>
      <Toaster position="bottom-center" offset="5vh" />
      <BowlContextProvider initialData={initialBowls}>
        <FlakeContextProvider initialData={initialFlakes}>
          <TodoContextProvider initialData={initialTodos}>
            <Outlet />
            <GlobalOutlet />
            <NavigationCommand />
          </TodoContextProvider>
        </FlakeContextProvider>
      </BowlContextProvider>
    </GlobalOutletProvider>
  )
}
