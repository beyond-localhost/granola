import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";

import { bowls } from "@/go/models";
import { BowlTable } from "./-components/bowl-table";

export const Route = createFileRoute("/bowls")({
  component: RouteComponent,
  loader: () => {
    return {
      bowlsPromise: new Promise<Array<bowls.Bowl>>((res) => {
        const ret: bowls.Bowl[] = [];
        if (Math.random() > 0.5) {
          res(ret);
          return;
        }

        for (let i = 0; i < 10; i++) {
          const bowl = new bowls.Bowl();
          bowl.id = i;
          bowl.name = String(Math.random());
          bowl.description = bowl.name.repeat(2);
          ret.push(bowl);
        }

        res(ret);
      }),
    };
  },
});

function RouteComponent() {
  const { bowlsPromise } = Route.useLoaderData();

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold">Categories</h1>
      <React.Suspense fallback={<span>loading..</span>}>
        <BowlTable bowlsPromise={bowlsPromise} />
      </React.Suspense>
    </div>
  );
}
