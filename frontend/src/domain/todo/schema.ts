import { z } from "zod"

const Todo = z.object({
  id: z.number(),
  flakeId: z.number(),
  done: z.coerce.boolean(),
  scheduledAt: z.coerce.date(),
})

type Todo = z.infer<typeof Todo>

const CreateTodo = Todo.pick({ flakeId: true, scheduledAt: true })
type CreateTodo = z.infer<typeof CreateTodo>

export { Todo, CreateTodo }
