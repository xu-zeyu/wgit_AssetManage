export function LoginBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-32 -left-32 size-[480px] rounded-full bg-brand-200/40 blur-3xl" />
      <div className="absolute -bottom-40 right-[-10%] size-[520px] rounded-full bg-brand-400/30 blur-3xl" />
      <div className="absolute left-1/2 top-1/3 size-[320px] -translate-x-1/2 rounded-full bg-amber-200/30 blur-3xl" />
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)',
          backgroundSize: '36px 36px',
        }}
      />
    </div>
  )
}
