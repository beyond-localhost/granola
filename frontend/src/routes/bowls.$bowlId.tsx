import * as React from "react";

import { createFileRoute, Link } from "@tanstack/react-router";
import * as bowlsService from "@/go/bowls/BowlsService";
import * as flakesService from "@/go/flakes/FlakeService";
import { Button } from "#/components/ui/button";

import { Route as flakeAddRoute } from "#/routes/bowls_.$bowlId.flakes.add";
import { FlakeDataTable } from "./-components/flake-data-table/flake-data-table";

export const Route = createFileRoute("/bowls/$bowlId")({
  component: RouteComponent,
  loader: async (ctx) => {
    return {
      bowl: await bowlsService.GetById(Number(ctx.params.bowlId)),
      flakesPromise: flakesService.GetAllByBowlId(Number(ctx.params.bowlId)),
    };
  },
});

function RouteComponent() {
  const params = Route.useParams();
  const { bowl, flakesPromise } = Route.useLoaderData();
  return (
    <div>
      <h1 className="font-bold text-2xl">{bowl.name}🥣</h1>
      <span>{params.bowlId}</span>
      <Button asChild>
        <Link from={Route.fullPath} to={flakeAddRoute.to}>
          Go
        </Link>
      </Button>
      <React.Suspense fallback={<div>Loading...</div>}>
        <FlakeDataTable bowlId={bowl.id} flakesPromise={flakesPromise} />
      </React.Suspense>
    </div>
  );
}
