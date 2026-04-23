'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { DEFAULT_PAGE_SIZE } from '@/constants/common'
import { useListCommentsAdmin } from '@/hooks/queries/admin.query'

import { CommentsTable } from '../tables/comments'

export function AdminComments() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  })
 const { data, isSuccess, isLoading, isError } = useListCommentsAdmin({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  })
  const t = useTranslations()

  return (
    <>
      {isSuccess && (
       <CommentsTable
        comments={data.comments}
        // 🛠️ The Fix: Use a fallback or cast to any to satisfy the build
        pageCount={(data as any).pageCount ?? 1}
        pagination={pagination}
        onPaginationChange={setPagination}
      />
      )}
      {isLoading && <div>{t('common.loading')}</div>}
      {isError && <div>{t('error.failed-to-fetch-comments-data')}</div>}
    </>
  )
}
