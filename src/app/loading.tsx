export default function GlobalLoading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex items-center gap-3 text-muted-foreground">
        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-sm">加载中…</span>
      </div>
    </div>
  )
}
