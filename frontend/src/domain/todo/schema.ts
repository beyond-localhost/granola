import { z } from "zod"

const Todo = z.object({
  id: z.number(),
  flakeId: z.number(),
  done: z.boolean(),
  scheduledAt: z.date(),
})

type Todo = z.infer<typeof Todo>

const CreateTodo = Todo.pick({ flakeId: true, scheduledAt: true })
type CreateTodo = z.infer<typeof CreateTodo>

export { Todo, CreateTodo }
