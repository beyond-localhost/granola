import { createFileRoute, Outlet } from "@tanstack/react-router";

import * as bowlService from "@/go/bowls/BowlsService";

export const Route = createFileRoute("/bowls")({
  loader: () => {
    return {
      bowlsPromise: bowlService.GetAll(),
    };
  },
  component: () => {
    return <Outlet />;
  },
});
