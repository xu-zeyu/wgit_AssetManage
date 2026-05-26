import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(1, '请输入账号').max(64, '账号过长'),
  password: z.string().min(1, '请输入密码').max(128, '密码过长'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
