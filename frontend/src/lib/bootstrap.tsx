import * as todosService from "@/go/todos/TodosService"
import * as bowlsService from "@/go/bowls/BowlsService"
import * as flakesService from "@/go/flakes/FlakeService"
import { Todo } from "#/domain/todo/schema"
import { Flake } from "#/domain/flake/schema"
import { Bowl } from "#/domain/bowl/schema"

const bootStrapPromise = Promise.all([
  bowlsService.GetAll().then((v) => v.map((vv) => Bowl.parse(vv))),
  flakesService.GetAll().then((v) => v.map((vv) => Flake.parse(vv))),
  todosService
    .GetAll()
    .then((v) =>
      v.map((vv) => Todo.parse({ ...vv, scheduledAt: new Date(vv.scheduledAt) }))
    ),
])

export { bootStrapPromise }
