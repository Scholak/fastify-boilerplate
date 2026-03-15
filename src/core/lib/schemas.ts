import { z } from 'zod'

export const errorResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
})

export function apiResponse<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    success: z.boolean(),
    code: z.string(),
    message: z.string(),
    data: dataSchema,
  })
}
