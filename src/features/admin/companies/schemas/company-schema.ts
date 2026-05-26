import { z } from 'zod'

export const companyFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, '请输入公司名称').max(64, '名称过长'),
  code: z.string().min(1, '请输入公司编码').max(64, '编码过长'),
  creditCode: z.string().max(64).nullable().optional(),
  address: z.string().max(255).optional(),
  adminId: z.coerce.number({ required_error: '请选择管理员' }).int().positive('请选择管理员'),
  rentPolicyId: z.coerce.number({ required_error: '请选择租金政策' }).int().positive('请选择租金政策'),
  icon: z
    .object({ id: z.number(), url: z.string() })
    .nullable()
    .optional(),
})

export type CompanyFormValues = z.infer<typeof companyFormSchema>
