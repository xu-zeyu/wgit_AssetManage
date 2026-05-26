const METRICS = [
  { label: '资产在线率', value: '98.4%' },
  { label: '待处理任务', value: '12' },
  { label: '协作公司', value: '08' },
]

export function LoginHero() {
  return (
    <section className="hidden max-w-2xl flex-1 flex-col gap-6 lg:flex">
      <div className="space-y-4">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-200/70 bg-white/70 px-3 py-1 text-xs font-medium text-brand-600 shadow-sm backdrop-blur">
          <span className="size-1.5 rounded-full bg-brand-400" />
          Asset intelligence cockpit
        </span>
        <div className="space-y-3">
          <h2 className="text-4xl font-semibold leading-tight tracking-tight text-foreground">
            让资产流转、审核与盘点
            <br />
            在一张可视化画布上完成
          </h2>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground">
            唯刚资产管理用更轻的卡片、更柔和的层次和更清晰的公司视角，
            取代传统 ERP 的高密度表格体验。
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white/65 p-6 shadow-md backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-foreground/80">多公司资产协同</div>
            <div className="mt-1 text-xs text-muted-foreground">动态总览 · 审核流 · 办公区域</div>
          </div>
          <div className="rounded-2xl bg-brand-50 px-3 py-1 text-xs font-medium text-brand-600">
            Live SVG
          </div>
        </div>

        <div className="mt-6 rounded-[28px] border border-brand-100/80 bg-[linear-gradient(135deg,rgba(255,248,235,0.96),rgba(255,255,255,0.9))] p-4">
          <svg viewBox="0 0 720 420" className="h-auto w-full" role="img" aria-label="资产管理动态示意图">
            <defs>
              <linearGradient id="hero-panel" x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#FFF7E5" />
                <stop offset="100%" stopColor="#FFFFFF" />
              </linearGradient>
              <linearGradient id="hero-line" x1="0%" x2="100%" y1="50%" y2="50%">
                <stop offset="0%" stopColor="#FDE0A5" stopOpacity="0.15" />
                <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#B7D7B0" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            <rect x="18" y="20" width="684" height="380" rx="32" fill="url(#hero-panel)" />
            <rect x="48" y="56" width="160" height="132" rx="24" fill="#FFFFFF" stroke="#FEEFD0" />
            <rect x="246" y="40" width="222" height="168" rx="28" fill="#FFFFFF" stroke="#FEEFD0" />
            <rect x="500" y="74" width="164" height="114" rx="24" fill="#FFFFFF" stroke="#FEEFD0" />
            <rect x="84" y="234" width="212" height="126" rx="28" fill="#FFFFFF" stroke="#FEEFD0" />
            <rect x="336" y="248" width="300" height="94" rx="26" fill="#FFFFFF" stroke="#FEEFD0" />

            <path d="M208 122H246" stroke="url(#hero-line)" strokeWidth="8" strokeLinecap="round">
              <animate attributeName="stroke-dasharray" dur="3.2s" repeatCount="indefinite" values="0 40;20 20;0 40" />
            </path>
            <path d="M468 122H500" stroke="url(#hero-line)" strokeWidth="8" strokeLinecap="round">
              <animate attributeName="stroke-dasharray" dur="2.8s" repeatCount="indefinite" values="0 36;18 18;0 36" />
            </path>
            <path d="M356 208V248" stroke="url(#hero-line)" strokeWidth="8" strokeLinecap="round">
              <animate attributeName="stroke-dasharray" dur="3s" repeatCount="indefinite" values="0 48;24 24;0 48" />
            </path>
            <path d="M192 188V234" stroke="url(#hero-line)" strokeWidth="8" strokeLinecap="round">
              <animate attributeName="stroke-dasharray" dur="3.4s" repeatCount="indefinite" values="0 44;22 22;0 44" />
            </path>

            <g transform="translate(76 84)">
              <rect width="104" height="12" rx="6" fill="#FEEFD0" />
              <rect y="26" width="72" height="10" rx="5" fill="#EDE7DA" />
              <rect y="54" width="96" height="48" rx="18" fill="#FFF8EB" />
              <circle cx="30" cy="78" r="12" fill="#FFB84D">
                <animate attributeName="r" dur="2.6s" repeatCount="indefinite" values="12;14;12" />
              </circle>
              <rect x="52" y="68" width="28" height="8" rx="4" fill="#F59E0B" opacity="0.35" />
              <rect x="52" y="82" width="20" height="8" rx="4" fill="#D6D1C8" />
            </g>

            <g transform="translate(274 70)">
              <rect width="82" height="12" rx="6" fill="#FEEFD0" />
              <rect x="0" y="28" width="166" height="18" rx="9" fill="#FFF8EB" />
              <rect x="0" y="62" width="44" height="70" rx="18" fill="#FFF2D8" />
              <rect x="58" y="62" width="44" height="54" rx="18" fill="#FFB84D" opacity="0.22" />
              <rect x="116" y="62" width="44" height="88" rx="18" fill="#CFE5C7" />
              <circle cx="184" cy="102" r="24" fill="#FFF7E4" stroke="#FDE0A5">
                <animateTransform
                  attributeName="transform"
                  dur="6s"
                  repeatCount="indefinite"
                  type="translate"
                  values="0 0; 0 -8; 0 0"
                />
              </circle>
              <path d="M184 89v26M171 102h26" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
            </g>

            <g transform="translate(528 102)">
              <rect width="92" height="12" rx="6" fill="#FEEFD0" />
              <rect y="28" width="106" height="58" rx="20" fill="#FFF8EB" />
              <path d="M24 70c12-18 22-18 34 0s22 18 34 0" fill="none" stroke="#B7D7B0" strokeWidth="6" strokeLinecap="round">
                <animate attributeName="d" dur="4s" repeatCount="indefinite" values="M24 70c12-18 22-18 34 0s22 18 34 0;M24 66c12-10 22-10 34 0s22 10 34 0;M24 70c12-18 22-18 34 0s22 18 34 0" />
              </path>
            </g>

            <g transform="translate(116 266)">
              <rect width="64" height="10" rx="5" fill="#FEEFD0" />
              <rect y="26" width="144" height="18" rx="9" fill="#FFF8EB" />
              <rect y="60" width="168" height="14" rx="7" fill="#F2EFE7" />
              <rect y="86" width="124" height="14" rx="7" fill="#F2EFE7" />
            </g>

            <g transform="translate(366 274)">
              <rect width="82" height="10" rx="5" fill="#FEEFD0" />
              <rect y="28" width="224" height="16" rx="8" fill="#FFF8EB" />
              <rect x="0" y="58" width="52" height="12" rx="6" fill="#CFE5C7" />
              <rect x="68" y="58" width="52" height="12" rx="6" fill="#FFD999" />
              <rect x="136" y="58" width="52" height="12" rx="6" fill="#FFD0C8" />
            </g>

            <circle cx="618" cy="58" r="10" fill="#FFB84D" opacity="0.85">
              <animateTransform
                attributeName="transform"
                dur="5s"
                repeatCount="indefinite"
                type="translate"
                values="0 0; -8 10; 0 0"
              />
            </circle>
            <circle cx="118" cy="42" r="8" fill="#B7D7B0" opacity="0.95">
              <animateTransform
                attributeName="transform"
                dur="4.6s"
                repeatCount="indefinite"
                type="translate"
                values="0 0; 10 8; 0 0"
              />
            </circle>
          </svg>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          {METRICS.map(metric => (
            <div key={metric.label} className="rounded-2xl border border-brand-100/70 bg-white/85 p-3">
              <div className="text-[11px] text-muted-foreground">{metric.label}</div>
              <div className="mt-1 text-xl font-semibold text-foreground">{metric.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
