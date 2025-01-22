import * as React from "react"

function useScrollLock(options: { open: boolean }) {
  React.useLayoutEffect(() => {
    if (!options.open) {
      return
    }
    const body = document.body
    body.classList.add("scroll-lock")
    return () => {
      body.classList.remove("scroll-lock")
    }
  }, [options.open])
}

export { useScrollLock }
