import { Deferred } from "./deferred";
import { EventsOff, EventsOnce, LogDebug } from "@/runtime";
import * as model from "@/go/models";

const initialBowls = new Deferred<model.bowls.Bowl[]>();
const initialBowlsPromise = initialBowls.promise();
const initialFlakes = new Deferred<model.flakes.Flake[]>();
const initialFlakesPromise = initialFlakes.promise();
const initialTodos = new Deferred<model.todos.Todo[]>();
const initialTodosPromise = initialTodos.promise();
LogDebug("(frontend) module initialized");
EventsOnce(
  "initialize",
  (
    bowls: model.bowls.Bowl[],
    flakes: model.flakes.Flake[],
    todos: model.todos.Todo[]
  ) => {
    LogDebug("(frontend) initialize hook...");
    LogDebug(JSON.stringify(bowls));
    LogDebug(JSON.stringify(flakes));
    LogDebug(JSON.stringify(todos));
    initialBowls.resolve(bowls);
    initialFlakes.resolve(flakes);
    initialTodos.resolve(todos);
    void EventsOff("initialize");
  }
);

export { initialBowlsPromise, initialFlakesPromise, initialTodosPromise };
