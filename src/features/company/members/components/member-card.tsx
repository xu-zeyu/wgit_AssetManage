'use client'

import { MoreHorizontal, Pencil, Phone, Trash2, UserCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { CompanyMember } from '../api/types'

interface Props {
  member: CompanyMember
  onOpen: () => void
  onEdit: () => void
  onDelete: () => void
}

export function MemberCard({ member, onOpen, onEdit, onDelete }: Props) {
  return (
    <Card className="group cursor-pointer transition-shadow hover:shadow-md" onClick={onOpen}>
      <CardContent className="flex items-center gap-3 p-4">
        <Avatar className="size-12">
          <AvatarImage src={`https://robohash.org/${member.user?.id ?? member.id}?set=set4&bgset=bg1`} />
          <AvatarFallback>{(member.name ?? member.user?.nickname ?? '?').charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex items-center gap-2">
            <h3 className="line-clamp-1 text-sm font-semibold">
              {member.name || member.user?.nickname || member.user?.username || '未命名'}
            </h3>
            {member.area?.name && <Badge variant="muted">{member.area.name}</Badge>}
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {member.mobile && (
              <span className="inline-flex items-center gap-1">
                <Phone className="size-3" />
                {member.mobile}
              </span>
            )}
            {member.department && (
              <span className="inline-flex items-center gap-1">
                <UserCircle2 className="size-3" />
                {member.department}
              </span>
            )}
          </div>
        </div>
        <div onClick={event => event.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="size-4" />
                编辑
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={onDelete}>
                <Trash2 className="size-4" />
                删除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}
