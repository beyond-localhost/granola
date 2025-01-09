import { LogError } from "@/runtime";

export function assert(
  expectedCondition: any,
  message: string
): asserts expectedCondition {
  if (!expectedCondition) {
    console.error(message);
    LogError(message);
    throw Error(message);
  }
}
