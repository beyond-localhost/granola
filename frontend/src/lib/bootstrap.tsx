import * as todosService from "@/go/todos/TodosService"
import * as bowlsService from "@/go/bowls/BowlsService"
import * as flakesService from "@/go/flakes/FlakesService"
import { Todo } from "#/domain/todo/schema"
import { Flake } from "#/domain/flake/schema"
import { Bowl } from "#/domain/bowl/schema"
import { LogDebug } from "@/runtime/runtime"

const bootStrapPromise = Promise.all([
  bowlsService.GetAll().then((v) => v.map((vv) => Bowl.parse(vv))),
  flakesService.GetAll().then((v) => v.map((vv) => Flake.parse(vv))),
  todosService.GetAll().then((v) =>
    v.map((vv) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- zod parse any to the date
        return Todo.parse({ ...vv, scheduledAt: vv.scheduledAt })
      } catch (e) {
        LogDebug(JSON.stringify(e, null, 4))
        throw e
      }
    })
  ),
])

export { bootStrapPromise }
