import { z } from 'zod'

export const officeAreaFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, '请输入名称').max(64),
  address: z.string().max(255).optional(),
  remark: z.string().max(255).optional(),
})

export type OfficeAreaFormValues = z.infer<typeof officeAreaFormSchema>
