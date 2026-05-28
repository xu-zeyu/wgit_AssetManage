import { z } from 'zod'

export const memberFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().trim().min(1, '请输入姓名').max(50, '姓名长度不能超过 50 个字符'),
  mobile: z.string().trim().regex(/^1[3-9]\d{9}$/, '请输入有效的手机号'),
  department: z.string().trim().max(50, '部门长度不能超过 50 个字符').optional().or(z.literal('')),
  position: z.string().trim().max(50, '职务长度不能超过 50 个字符').optional().or(z.literal('')),
  areaId: z.number().optional().nullable(),
})

export type MemberFormValues = z.infer<typeof memberFormSchema>
