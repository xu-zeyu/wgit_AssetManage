import { z } from 'zod'

export const policyFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, '请输入策略名称').max(50, '长度不超过 50 个字符'),
  discount: z.coerce
    .number({ invalid_type_error: '请输入折扣' })
    .min(0, '折扣最小为 0')
    .max(1, '折扣最大为 1'),
})

export type PolicyFormValues = z.infer<typeof policyFormSchema>
