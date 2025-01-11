import * as React from "react";

import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";

import { Route as flakeAddRoute } from "#/routes/bowls_.$bowlId.flakes.add";
import { FlakeDataTable } from "./-components/flake-data-table/flake-data-table";
import { useBowlContext } from "#/lib/state";
import { assert } from "#/lib/assert";

export const Route = createFileRoute("/bowls/$bowlId")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();

  const bowl = useBowlContext((state) => {
    const map = state.map;
    const bowl = map.get(Number(params.bowlId));
    assert(
      bowl != null,
      `The bowl must exist when navigating to The bowls/${params.bowlId} route.`
    );
    return bowl;
  });

  return (
    <div>
      <h1 className="font-bold text-2xl">{bowl.name}🥣</h1>
      <span>{params.bowlId}</span>
      <Button asChild>
        <Link from={Route.fullPath} to={flakeAddRoute.to}>
          Go
        </Link>
      </Button>
      <FlakeDataTable bowlId={bowl.id} />
      <React.Suspense fallback={<div>Loading...</div>}></React.Suspense>
    </div>
  );
}
