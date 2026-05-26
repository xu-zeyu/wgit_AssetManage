import { z } from 'zod'

export const assetSkuFormSchema = z.object({
  id: z.number().optional(),
  code: z.string().optional(),
  name: z.string().min(1, '请输入资产名称').max(64, '名称过长'),
  spec: z.string().max(120).optional(),
  category: z.string().optional(),
  useTarget: z.string().max(255).optional(),
  rentPrice: z.coerce.number().min(0, '租金不能为负').default(0),
  purchaseChannel: z.string().max(120).optional().nullable(),
  purchaseTime: z.string().optional().nullable(),
  purchasePrice: z.coerce.number().min(0).optional().nullable(),
  afterSale: z.string().max(255).optional().nullable(),
  remark: z.string().max(500).optional().nullable(),
  companyIds: z.array(z.number()).min(1, '至少选择一个公司'),
  images: z.array(z.object({ id: z.number(), url: z.string() })).optional().default([]),
})

export type AssetSkuFormValues = z.infer<typeof assetSkuFormSchema>
