import { z } from "zod"

const Bowl = z.object({
  id: z.number(),
  name: z
    .string()
    .min(1, "주제를 만들기 위해선 반드시 이름이 있어야해요")
    .max(20, "주제는 최대 20자까지 작성할 수 있어요"),
  description: z
    .string({ invalid_type_error: "올바른 형식의 설명을 입력해주셔야해요." })
    .optional(),
})
type Bowl = z.infer<typeof Bowl>

const CreateBowl = Bowl.omit({ id: true })
type CreateBowl = z.infer<typeof CreateBowl>

export { Bowl, CreateBowl }
