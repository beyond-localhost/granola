import { Deferred } from "./deferred";
import { LogDebug } from "@/runtime";
import * as todosService from "@/go/todos/TodosService";
import * as bowlsService from "@/go/bowls/BowlsService";
import * as flakesService from "@/go/flakes/FlakeService";
import * as model from "@/go/models";

const initialBowls = new Deferred<model.bowls.Bowl[]>();
const initialBowlsPromise = initialBowls.promise();
const initialFlakes = new Deferred<model.flakes.Flake[]>();
const initialFlakesPromise = initialFlakes.promise();
const initialTodos = new Deferred<model.todos.Todo[]>();
const initialTodosPromise = initialTodos.promise();

const bootStrapPromise = Promise.all([
  bowlsService.GetAll(),
  flakesService.GetAll(),
  todosService.GetAll(),
]);

bootStrapPromise.then(([bowls, flakes, todos]) => {
  initialBowls.resolve(bowls);
  initialFlakes.resolve(flakes);
  initialTodos.resolve(todos.map(model.todos.Todo.createFrom));
});

export {
  initialBowlsPromise,
  initialFlakesPromise,
  initialTodosPromise,
  bootStrapPromise,
};
