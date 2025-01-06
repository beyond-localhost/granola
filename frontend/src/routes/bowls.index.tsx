import * as React from "react";

import { createFileRoute, getRouteApi } from "@tanstack/react-router";

import { BowlTable } from "./-components/bowl-table";
import * as bowlService from "@/go/bowls/BowlsService";

const bowlsApi = getRouteApi("/bowls");

export const Route = createFileRoute("/bowls/")({
  component: RouteComponent,
  loader: () => {
    return {
      bowlsPromise: bowlService.GetAll(),
    };
  },
});

function RouteComponent() {
  const { bowlsPromise } = bowlsApi.useLoaderData();

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold">Categories</h1>
      <React.Suspense fallback={<span>loading..</span>}>
        <BowlTable bowlsPromise={bowlsPromise} />
      </React.Suspense>
    </div>
  );
}
