import * as React from "react";
import { initialBowlsPromise } from "#/lib/bootstrap";
import { SidebarProvider } from "../ui/sidebar";

import * as model from "@/go/models";

type Bowl = model.bowls.Bowl;

const AppSidebarContext = React.createContext<{
  bowls: Array<Bowl>;
  onAdd: (v: Bowl) => void;
  onDelete: (v: Bowl) => void;
  onUpdate: (v: Bowl) => void;
} | null>(null);

/**
 * AppSidebarProvider caches bowls not to invalidate the root route.
 * The bowls can be created, updated, deleted within the specific route. At the same time,
 *  The side effects of left sidebar should be affected.
 * This provider uses React.use as to fetching the initial value of bowls.
 *  Normally, we can use Suspense on the __root to show the loading state of App, but This time, We skip it and prefetch bowls when
 *  our app is initialized.
 */
function AppSidebarProvider({ children }: { children: React.ReactNode }) {
  const initialValue = React.use(initialBowlsPromise);
  const [state, setState] = React.useState(initialValue);
  const onAdd = React.useCallback((value: Bowl) => {
    setState((prev) => {
      if (prev.indexOf(value) !== -1) {
        return prev;
      }
      return prev.concat(value);
    });
  }, []);

  const onDelete = React.useCallback((value: Bowl) => {
    setState((prev) => {
      const next = prev.filter((v) => v !== value);
      if (next.length === prev.length) {
        return prev;
      }
      return next;
    });
  }, []);

  const onUpdate = React.useCallback((value: Bowl) => {
    setState((prev) => {
      const copy = prev.slice();
      const index = prev.indexOf(value);
      if (index === -1) {
        return prev;
      }
      copy[index] = value;
      return copy;
    });
  }, []);

  const deps = React.useMemo(
    () => ({ bowls: state, onAdd, onDelete, onUpdate }),
    [state, onAdd, onDelete, onUpdate]
  );

  return (
    <SidebarProvider>
      <AppSidebarContext value={deps}>{children}</AppSidebarContext>
    </SidebarProvider>
  );
}

function useAppSidebar() {
  const ctx = React.use(AppSidebarContext);
  if (ctx == null) {
    throw new Error(
      "useAppSidebar should be called within AppSidebarProvider."
    );
  }
  return ctx;
}

export { AppSidebarProvider, useAppSidebar };
