import { createFileRoute } from "@tanstack/react-router";
import { BowlList } from "./-components/bowl-list/bowl-list";
import { FlakeList } from "./-components/flake-list/flake-list";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="p-4 bg-gradient-to-r from-zinc-50/20 to-zinc-100/80 h-screen">
      <BowlList />
      <div className="mt-10">
        <FlakeList />
      </div>
      <div className="mt-10">
        <p>
          네비게이션은
          <code className="p-1 bg-pink-900/10">/</code>으로 할 수 있어요.
        </p>
      </div>
    </main>
  );
}
