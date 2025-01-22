import { LogDebug } from "@/runtime"

export function assert(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is kind of typescript hack
  expectedCondition: any,
  message: string
): asserts expectedCondition {
  if (!expectedCondition) {
    LogDebug(`<Frontend> An error occured: ${message}`)
    throw new Error(message)
  }
}
