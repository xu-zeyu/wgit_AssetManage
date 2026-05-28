import { z } from 'zod'

export const assetApplicationSchema = z.object({
  assetSkuId: z.string().min(1, '请选择资产标的'),
  userIds: z.array(z.number()).min(1, '至少选择一位申领取人'),
})

export type AssetApplicationFormValues = z.infer<typeof assetApplicationSchema>
