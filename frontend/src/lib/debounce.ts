// eslint-disable-next-line @typescript-eslint/no-explicit-any -- The debounce should accepts "any props" and returns the function that returns "any arugments"
function debounce<TFunc extends (...args: any[]) => any>(func: TFunc, delayMS: number) {
  let timeout: ReturnType<typeof globalThis.setTimeout> | null = null

  function debounced(this: ThisParameterType<TFunc>, ...args: Parameters<TFunc>) {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      func.apply(this, args)
      timeout = null
    }, delayMS)
  }

  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }

  return debounced
}

export { debounce }
