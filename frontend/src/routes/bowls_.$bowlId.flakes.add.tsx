import * as React from "react";

import { useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

import { LoaderPinwheel } from "lucide-react";

import { Textarea } from "#/components/ui/textarea";
import { Input } from "#/components/ui/input";
import { Button } from "#/components/ui/button";

import * as flakesService from "@/go/flakes/FlakeService";
import { useFlakeContext } from "#/lib/state";

export const Route = createFileRoute("/bowls_/$bowlId/flakes/add")({
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
  message: "Add to flake",
};

function RouteComponent() {
  const params = Route.useParams();
  const navigate = useNavigate({ from: Route.fullPath });
  const bowlId = Number(params.bowlId);
  const add = useFlakeContext((state) => state.add);

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
      const f = await flakesService.Create(name, description, bowlId);
      add(f);
    }

    try {
      return {
        status: "success",
        message: "Success to add the flake.",
      };
    } catch {
      return {
        status: "error",
        message: "The name or description is invalid. or router is invalid",
      };
    }
  }, initialFormState);

  React.useEffect(() => {
    if (state.status === "success") {
      navigate({ to: "/bowls/$bowlId" });
    }
  }, [state, bowlId, navigate]);

  return (
    <form action={formAction}>
      <fieldset>
        <legend className="text-2xl font-bold">Create a flake..</legend>
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
  );
}
