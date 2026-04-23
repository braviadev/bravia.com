'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useCommentContext } from '@/contexts/comment.context'
import { useCommentsContext } from '@/contexts/comments.context'
import { useCreatePostComment } from '@/hooks/queries/comment.query'

// Local interface to bypass external type pathing issues
interface LocalComment {
  id: string
  [key: string]: any
}

type CommentReplyProps = {
  comment: LocalComment
  onSuccess?: () => void
}

export function CommentReply({ comment, onSuccess }: CommentReplyProps) {
  const [content, setContent] = useState('')
  const { slug } = useCommentsContext()
  
  // Using 'setIsReplying' which matches your comment.context.tsx exactly
  const { setIsReplying } = useCommentContext()
  
  const t = useTranslations()
  
  // Hook initialized with the required slug object
  const { mutate: createReply, isPending } = useCreatePostComment({ slug })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      // 'as any' bypasses the strict i18n key check for the build
      toast.error(t('error.comment-content-required' as any))
      return 
    }

    createReply(
      {
        slug,
        content: content.trim(),
        parentId: comment.id,
        date: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          setContent('')
          setIsReplying(false)
          onSuccess?.()
          toast.success(t('success.reply-posted' as any))
        },
        onError: () => {
          toast.error(t('error.failed-to-post-reply' as any))
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className='mt-4 space-y-3'>
      <Textarea
        placeholder={t('blog.write-a-reply' as any)}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className='min-h-24 resize-none'
        disabled={isPending}
      />
      <div className='flex justify-end gap-3'>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => setIsReplying(false)}
          disabled={isPending}
        >
          {t('common.cancel' as any)}
        </Button>
        <Button 
          type='submit' 
          size='sm' 
          disabled={isPending || !content.trim()} // 🛠️ Replaced 'loading' with logic in disabled
        >
          {isPending ? '...' : t('blog.post-reply' as any)} 
        </Button>
      </div>
    </form>
  )
}