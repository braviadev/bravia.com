import type { ColumnDef } from '@tanstack/react-table'
import type { AdminCommentListOutput } from '@/orpc/client'
import { useTranslations } from 'next-intl'
import { Link } from '@/components/ui/link'
import { UserAvatar } from '@/components/ui/user-avatar'
import { FormattedDateCell } from '../formatted-date-cell'

export type Comment = AdminCommentListOutput['comments'][number]

export function useColumns(): Array<ColumnDef<Comment>> {
  const t = useTranslations()

  return [
    {
      accessorKey: 'userId',
      header: t('components.tables.comments.user' as any),
      cell: ({ row }) => {
        const original = row.original as any
        const userName = original.user?.name ?? 'User'
        return (
          <div className='flex items-center gap-2'>
            <UserAvatar id={original.userId} name={userName} image={original.user?.image} size='sm' />
            <span className='text-sm font-medium'>{userName}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'body',
      header: t('components.tables.comments.comment' as any),
    },
    {
      accessorKey: 'postId',
      header: t('components.tables.comments.post' as any),
      cell: ({ row }) => (
        <Link
          href={{
            pathname: `/blog/${row.original.postId}`,
            query: {
              comment: row.original.parentId ?? row.original.id,
              ...(row.original.parentId && { reply: row.original.id }),
            },
          }}
          className='underline underline-offset-4'
        >
          {row.original.postId}
        </Link>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: t('components.tables.comments.created-at' as any),
      cell: ({ row }) => <FormattedDateCell date={row.original.createdAt} />,
    },
  ]
}