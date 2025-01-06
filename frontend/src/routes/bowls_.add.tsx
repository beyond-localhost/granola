import * as React from "react";

import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import { createFileRoute } from "@tanstack/react-router";
import * as bowlService from "@/go/bowls/BowlsService";
import { LoaderPinwheel } from "lucide-react";
import { LogDebug } from "@/runtime";

export const Route = createFileRoute("/bowls_/add")({
  component: RouteComponent,
});

const NAME_PLACEHOLDER = "20자 이내로 작성해주세요";
const DESCRIPTION_PLACEHOLDER = "무슨 일들이 일어날까요?";

type FormState =
  | { status: "idle"; message: string }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

const initialFormState: FormState = {
  status: "idle",
  message: "Add this topc",
};

function RouteComponent() {
  const [state, formAction, isPending] = React.useActionState<
    FormState,
    FormData
  >(async function submitAction(_, formData) {
    const name = formData.get("name");
    const description = formData.get("description");
    if (
      typeof name === "string" &&
      name.length > 0 &&
      (typeof description === "string" || description === null)
    ) {
      LogDebug(JSON.stringify({ name, description }));
      await bowlService.Create(name, description);
      return { status: "success", message: "Success to add the topic. " };
    }
    return {
      status: "error",
      message: "The name or description is invalid.",
    };
  }, initialFormState);

  return (
    <div>
      <form action={formAction}>
        <fieldset>
          <legend className="text-2xl font-bold">Create a Topic..</legend>
          <label htmlFor="name" className="block mt-8">
            <p>name</p>
            <Input
              id="name"
              name="name"
              required
              placeholder={NAME_PLACEHOLDER}
            />
          </label>
          <label htmlFor="description" className="block mt-4">
            <p>description</p>
            <Textarea
              id="description"
              name="description"
              className="resize-none min-h-[200px] transition-colors"
              placeholder={DESCRIPTION_PLACEHOLDER}
            />
          </label>
        </fieldset>
        <div className="mt-4">
          <Button
            type="submit"
            variant="default"
            disabled={state.status !== "idle" && state.status !== "error"}
          >
            {isPending ? <LoaderPinwheel /> : state.message}
          </Button>
        </div>
      </form>
    </div>
  );
}
