import * as todosService from "@/go/todos/TodosService"
import * as bowlsService from "@/go/bowls/BowlsService"
import * as flakesService from "@/go/flakes/FlakeService"
import * as model from "@/go/models"

const bootStrapPromise = Promise.all([
  bowlsService.GetAll(),
  flakesService.GetAll(),
  todosService
    .GetAll()
    .then((v) => v.map((todoRaw) => model.todos.Todo.createFrom(todoRaw))),
])

export { bootStrapPromise }
