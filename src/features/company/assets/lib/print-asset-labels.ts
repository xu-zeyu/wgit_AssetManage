import QRCode from 'qrcode'
import type { CompanyAsset } from '../api/types'

export async function printAssetLabels(assets: CompanyAsset[]) {
  const qrCodes = await Promise.all(
    assets.map(async asset => ({
      asset,
      dataUrl: await QRCode.toDataURL(`assetCode:${asset.assetCode}`, {
        width: 180,
        margin: 0,
        color: { dark: '#000000', light: '#ffffff' },
      }),
    })),
  )

  const content = `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>资产标签打印</title>
      <style>
        @page { size: 80mm 40mm; margin: 0; }
        * { box-sizing: border-box; font-family: "PingFang SC", "Microsoft YaHei", sans-serif; }
        body { margin: 0; padding: 0; }
        .label-box { width: 100%; height: 40mm; padding: 2px 4px 0; page-break-inside: avoid; }
        .label-container { display: flex; width: 100%; height: 36mm; align-items: center; }
        .qr-box { width: 26mm; display: flex; flex-direction: column; gap: 6px; }
        .qr-box img { width: 26mm; height: 26mm; object-fit: contain; }
        .label-text { font-size: 8px; text-align: center; word-break: break-all; }
        .info { flex: 1; padding-left: 2mm; }
        table { width: 100%; border-collapse: collapse; table-layout: fixed; }
        td { border: 1px solid #000; padding: 2px; font-size: 9px; font-weight: 700; word-break: break-all; }
        .label { width: 11mm; }
      </style>
    </head>
    <body>
      ${qrCodes
        .map(
          ({ asset, dataUrl }) => `
            <div class="label-box">
              <div class="label-container">
                <div class="qr-box">
                  <img src="${dataUrl}" alt="资产二维码" />
                  <div class="label-text">${escapeHtml(asset.assetCode)}</div>
                </div>
                <div class="info">
                  <table>
                    ${buildRows(asset)}
                  </table>
                </div>
              </div>
            </div>
          `,
        )
        .join('')}
    </body>
  </html>`

  await new Promise<void>((resolve, reject) => {
    const iframe = document.createElement('iframe')
    iframe.style.position = 'fixed'
    iframe.style.visibility = 'hidden'
    iframe.style.width = '0'
    iframe.style.height = '0'
    document.body.appendChild(iframe)

    const doc = iframe.contentDocument
    if (!doc) {
      document.body.removeChild(iframe)
      reject(new Error('打印初始化失败'))
      return
    }

    doc.open()
    doc.write(content)
    doc.close()

    const handlePrint = () => {
      setTimeout(() => {
        try {
          iframe.contentWindow?.print()
          resolve()
        } catch (error) {
          reject(error)
        } finally {
          setTimeout(() => document.body.removeChild(iframe), 1000)
        }
      }, 500)
    }

    if (iframe.contentWindow?.document.readyState === 'complete') handlePrint()
    else iframe.onload = handlePrint
  })
}

function buildRows(asset: CompanyAsset) {
  return [
    ['名称', asset.assetAssetSkuName || ''],
    ['使用人', asset.rentalUserName || ''],
    ['位置', asset.rentalUserRentalUserAreaName || ''],
    ['备注', asset.remark || ''],
  ]
    .map(([label, value]) => `<tr><td class="label">${label}</td><td>${escapeHtml(value)}</td></tr>`)
    .join('')
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}
