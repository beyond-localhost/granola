import { createFileRoute } from "@tanstack/react-router";
import * as bowlsService from "@/go/bowls/BowlsService";

export const Route = createFileRoute("/bowls_/$bowlId")({
  component: RouteComponent,
  loader: (ctx) => {
    return bowlsService.GetById(Number(ctx.params.bowlId));
  },
});

function RouteComponent() {
  const params = Route.useParams();
  const data = Route.useLoaderData();
  return (
    <div>
      <h1 className="font-bold text-2xl">{data.name}🥣</h1>
      <span>{params.bowlId}</span>
    </div>
  );
}
