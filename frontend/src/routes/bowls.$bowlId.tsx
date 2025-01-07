import { createFileRoute, Link } from "@tanstack/react-router";
import * as bowlsService from "@/go/bowls/BowlsService";
import { Button } from "#/components/ui/button";

import { Route as flakeAddRoute } from "#/routes/bowls_.$bowlId.flakes.add";

export const Route = createFileRoute("/bowls/$bowlId")({
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
      <Button asChild>
        <Link from={Route.fullPath} to={flakeAddRoute.to}>
          Go
        </Link>
      </Button>
    </div>
  );
}
