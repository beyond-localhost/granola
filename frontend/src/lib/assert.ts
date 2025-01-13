import { LogDebug } from "@/runtime";

export function assert(
  expectedCondition: any,
  message: string
): asserts expectedCondition {
  if (!expectedCondition) {
    console.error(message);
    LogDebug(`<Frontend> An error occured: ${message}`);
    throw new Error(message);
  }
}
