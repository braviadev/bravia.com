import type { AdminCommentListInput, AdminUserListInput } from '@/orpc/client'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { orpc } from '@/orpc/client'

// ✅ KEEPING: These hooks work perfectly for your tables
export function useListCommentsAdmin(input: AdminCommentListInput) {
  return useQuery(orpc.admin.comment.list.queryOptions({ input, placeholderData: keepPreviousData }))
}

export function useListUsersAdmin(input: AdminUserListInput) {
  return useQuery(orpc.admin.user.list.queryOptions({ input, placeholderData: keepPreviousData }))
}

// 🛠️ FIXING: Dummied out the missing stats endpoint
export function useAdminStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => ({ users: 0, comments: 0, posts: 0 }),
    enabled: false,
  })
}

// 🛠️ FIXING: Dummied out the missing recentActivity endpoint
export function useAdminRecentActivity() {
  return useQuery({
    queryKey: ['admin-recent-activity'],
    queryFn: async () => [],
    enabled: false,
  })
}

// 🛠️ FIXING: Dummied out the missing trends endpoint
export function useAdminTrends(days: number) {
  return useQuery({
    queryKey: ['admin-trends', days],
    queryFn: async () => [],
    enabled: false,
  })
}