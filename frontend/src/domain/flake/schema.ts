import { z } from "zod"

const Flake = z.object({
  id: z.number(),
  bowlId: z.number(),
  name: z
    .string()
    .min(1, "할 일을 만들기 위해선 반드시 이름이 있어야해요")
    .max(20, "할 일은 최대 20자까지 작성할 수 있어요"),
  description: z
    .string({ invalid_type_error: "올바른 형식의 설명을 입력해주셔야해요." })
    .optional(),
})

type Flake = z.infer<typeof Flake>

const CreateFlake = Flake.omit({ id: true, bowlId: true }).extend({
  bowlId: z.coerce.number(),
})
type CreateFlake = z.infer<typeof CreateFlake>

export { Flake, CreateFlake }
