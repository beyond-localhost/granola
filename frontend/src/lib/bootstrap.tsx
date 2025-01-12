import { Deferred } from "./deferred";
import { LogDebug } from "@/runtime";
import * as todosService from "@/go/todos/TodosService";
import * as bowlsService from "@/go/bowls/BowlsService";
import * as flakesSErvice from "@/go/flakes/FlakeService";
import * as model from "@/go/models";

const initialBowls = new Deferred<model.bowls.Bowl[]>();
const initialBowlsPromise = initialBowls.promise();
const initialFlakes = new Deferred<model.flakes.Flake[]>();
const initialFlakesPromise = initialFlakes.promise();
const initialTodos = new Deferred<model.todos.Todo[]>();
const initialTodosPromise = initialTodos.promise();

const bootStrapPromise = Promise.all([
  bowlsService.GetAll(),
  flakesSErvice.GetAll(),
  todosService.GetAll(),
]);

bootStrapPromise.then(([bowls, flakes, todos]) => {
  LogDebug(JSON.stringify(bowls));
  LogDebug(JSON.stringify(flakes));
  LogDebug(JSON.stringify(todos));
  initialBowls.resolve(bowls);
  initialFlakes.resolve(flakes);
  initialTodos.resolve(todos);
});

export {
  initialBowlsPromise,
  initialFlakesPromise,
  initialTodosPromise,
  bootStrapPromise,
};
