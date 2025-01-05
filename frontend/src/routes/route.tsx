import { Button } from "#/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="text-red-300">
      Hello world
      <Button>hello shadcn/ui</Button>
    </div>
  );
}
