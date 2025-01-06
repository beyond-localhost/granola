import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/bowls_/$bowlId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/bowls_/$bowlId"!</div>;
}
