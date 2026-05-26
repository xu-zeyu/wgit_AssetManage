import { z } from 'zod'

export const companyInfoFormSchema = z.object({
  id: z.number(),
  name: z.string().min(1, '请输入公司名称').max(64),
  creditCode: z.string().max(64).optional().or(z.literal('')),
  address: z.string().max(255).optional().or(z.literal('')),
  icon: z
    .object({ id: z.number(), url: z.string() })
    .nullable()
    .optional(),
})

export type CompanyInfoFormValues = z.infer<typeof companyInfoFormSchema>
