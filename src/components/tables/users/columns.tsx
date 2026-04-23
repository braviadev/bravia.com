import type { ColumnDef } from '@tanstack/react-table'
import type { AdminUserListOutput } from '@/orpc/client'

import { useTranslations } from 'next-intl'
import { UserAvatar } from '@/components/ui/user-avatar'
import { FormattedDateCell } from '../formatted-date-cell'

export type User = AdminUserListOutput['users'][number]

export function useColumns(): Array<ColumnDef<User>> {
  const t = useTranslations()

  return [
    {
      accessorKey: 'name',
      header: t('components.tables.users.name' as any),
      cell: ({ row }) => {
        // 🛠️ Cast to any so TypeScript doesn't check for 'image'
        const original = row.original as any
        
        return (
          <div className='flex items-center gap-2'>
            <UserAvatar 
              id={original.id} 
              name={original.name} 
              image={original.image} 
              size='sm' 
            />
            {original.name}
          </div>
        )
      },
    },
    {
      accessorKey: 'email',
      header: t('components.tables.users.email' as any),
    },
    {
      accessorKey: 'role',
      header: t('components.tables.users.role' as any),
      cell: ({ row }) => (
        <span className='capitalize'>{row.original.role}</span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: t('components.tables.users.created-at' as any),
      cell: ({ row }) => <FormattedDateCell date={row.original.createdAt} />,
    },
  ]
}