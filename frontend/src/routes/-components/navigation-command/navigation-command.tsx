import * as React from "react"
import * as ReactDOM from "react-dom"
import { Transition, TransitionChild } from "@headlessui/react"
import { Link } from "@tanstack/react-router"
import { Calendar, Home } from "lucide-react"
import { Command, CommandItem, CommandList } from "#/components/ui/command"
import { useGlobalOutletSetter } from "#/components/portal"
import { useScrollLock } from "#/lib/scroll-lock"
import { cn } from "#/lib/utils"

const NAVIGAION_COMMAND_ID = "navigation-command"

function NavigationCommand() {
  const setter = useGlobalOutletSetter()
  React.useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "/") {
        event.preventDefault()
        setter.append(
          NAVIGAION_COMMAND_ID,
          <NavigationCommandPortal
            onClose={() => {
              setter.remove(NAVIGAION_COMMAND_ID)
            }}
          />
        )
      }
    }
    window.addEventListener("keydown", handleKeydown)
    return () => {
      window.removeEventListener("keydown", handleKeydown)
    }
  }, [setter])

  return null
}

type NavigationCommandPortalProps = {
  onClose: () => void
}

function NavigationCommandPortal({ onClose }: NavigationCommandPortalProps) {
  const [open, setOpen] = React.useState(true)
  useScrollLock({ open: true })

  React.useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault()
        setOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeydown)
    return () => {
      window.removeEventListener("keydown", handleKeydown)
    }
  }, [setOpen])

  return ReactDOM.createPortal(
    <Transition show={open} afterLeave={onClose} appear>
      <TransitionChild>
        <div
          onClick={() => {
            setOpen(false)
          }}
          className={cn(
            "fixed inset-0 w-full backdrop-blur-sm transition-all",
            "data-[closed]:backdrop-blur-none bg-transparent",
            "data-[enter]:duration-150",
            "data-[leave]:duration-150"
          )}
        />
      </TransitionChild>

      <TransitionChild>
        <Command
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[60vh] border border-zinc-950",
            "data-[closed]:scale-0",
            "data-[enter]:delay-200 data-[enter]:duration-200",
            "data-[leave]:delay-0 data-[leave]:duration-300"
          )}
        >
          <CommandList>
            <CommandItem className="p-4 font-medium text-xl" asChild>
              <Link
                onClick={() => {
                  setOpen(false)
                }}
                to="/"
              >
                <Home strokeWidth={2} size={20} />
                메인 페이지
              </Link>
            </CommandItem>
            <CommandItem className="p-4 font-medium text-xl" asChild>
              <Link
                onClick={() => {
                  setOpen(false)
                }}
                to="/calendar"
              >
                <Calendar strokeWidth={2} size={20} />
                달력 페이지
              </Link>
            </CommandItem>
          </CommandList>
        </Command>
      </TransitionChild>
    </Transition>,
    document.body
  )
}

export { NavigationCommand }
