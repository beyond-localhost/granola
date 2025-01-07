import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/bowls_/$bowlId")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  return (
    <div>
      Hello "/bowls_/$bowlId"!
      <span>{params.bowlId}</span>
    </div>
  );
}
