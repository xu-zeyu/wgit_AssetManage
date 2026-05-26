'use client'

import { useRouter } from 'next/navigation'
import { LogOut, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useUserStore } from '@/stores/use-user-store'
import { useBadgeStore } from '@/stores/use-badge-store'
import type { AppRole } from '@/permissions/roles'
import { Breadcrumb } from './breadcrumb'

interface Props {
  role: AppRole
}

export function Topbar({ role }: Props) {
  const router = useRouter()
  const name = useUserStore(s => s.name)
  const userInfo = useUserStore(s => s.userInfo)
  const logout = useUserStore(s => s.logout)
  const stopPolling = useBadgeStore(s => s.stopPolling)
  const { theme, setTheme } = useTheme()

  async function handleLogout() {
    try {
      await logout()
      stopPolling()
      toast.success('已退出登录')
      router.replace('/login')
    } catch {
      toast.error('退出登录失败')
    }
  }

  const avatarUrl = userInfo?.id
    ? `https://robohash.org/${userInfo.id}?set=set4&bgset=bg1`
    : undefined

  return (
    <div className="flex flex-1 items-center justify-between gap-4">
      <Breadcrumb role={role} />
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="切换主题"
        >
          {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-2xl px-2 py-1 transition-colors hover:bg-accent">
            <Avatar className="size-8">
              {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
              <AvatarFallback>{name?.charAt(0) ?? '?'}</AvatarFallback>
            </Avatar>
            <div className="hidden text-left sm:block">
              <div className="text-sm font-medium leading-none">{name || '未登录'}</div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">
                {role === 'admin' ? '平台管理员' : '公司管理员'}
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{userInfo?.nickname ?? '当前账户'}</DropdownMenuLabel>
            {userInfo?.username && (
              <div className="px-2 pb-1 text-xs text-muted-foreground">{userInfo.username}</div>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="size-4" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
