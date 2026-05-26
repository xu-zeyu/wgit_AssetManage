'use client'

import { useRef, useState } from 'react'
import { ImagePlus, Loader2, X } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { uploadFile } from '@/services/files/upload-file'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface UploadedImage {
  id: number
  url: string
}

interface Props {
  value?: UploadedImage | null
  onChange?: (value: UploadedImage | null) => void
  accept?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  label?: string
}

const SIZES = {
  sm: 'size-16',
  md: 'size-24',
  lg: 'size-32',
}

export function ImageUpload({
  value,
  onChange,
  accept = 'image/*',
  size = 'md',
  className,
  label = '选择图片',
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)

  async function handleFile(file?: File) {
    if (!file) return
    setLoading(true)
    try {
      const res = await uploadFile(file)
      if (res.code === '200') {
        const next = { id: res.data.id, url: res.data.url }
        onChange?.(next)
        toast.success('上传成功')
      } else {
        toast.error(res.message || '上传失败')
      }
    } catch {
      toast.error('上传失败')
    } finally {
      setLoading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className={cn('flex items-start gap-3', className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={e => handleFile(e.target.files?.[0])}
      />
      {value ? (
        <div className={cn('relative overflow-hidden rounded-2xl border', SIZES[size])}>
          <Image src={value.url} alt="" fill sizes="128px" className="object-cover" />
          <button
            type="button"
            onClick={() => onChange?.(null)}
            className="absolute right-1 top-1 rounded-full bg-background/80 p-1 text-foreground shadow hover:bg-background"
          >
            <X className="size-3" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex flex-col items-center justify-center gap-1 rounded-2xl border border-dashed text-muted-foreground transition-colors hover:border-primary hover:text-primary',
            SIZES[size],
          )}
          disabled={loading}
        >
          {loading ? <Loader2 className="size-5 animate-spin" /> : <ImagePlus className="size-5" />}
          <span className="text-[11px]">{loading ? '上传中' : label}</span>
        </button>
      )}
    </div>
  )
}
