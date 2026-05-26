import { request } from '@/services/http/request'
import type { ApiResult } from '@/services/http/types'

export interface UploadedFile {
  id: number
  storageKey: string
  storageProvider: string
  originalFilename: string
  contentType: string
  contentLength: number
  url: string
  userId: number
}

export function uploadFile(file: File): Promise<ApiResult<UploadedFile>> {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/v1/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
