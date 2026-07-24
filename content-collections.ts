import type { CollectionContext, Meta } from '@content-collections/core'

import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMDX } from '@content-collections/mdx'
import { x } from 'tinyexec'
import * as z from 'zod'

import { getTOC, rehypePlugins, remarkPlugins } from '@/mdx-plugins'

type BaseDoc = {
  _meta: Meta
  content: string
}

// Helper to prevent "Invalid time value" crashes
function safeDate(dateStr: string) {
  if (!dateStr) return new Date().toISOString();
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

async function transform<TDoc extends BaseDoc>(document: TDoc, context: CollectionContext) {
  const code = await compileMDX(context, document, {
    remarkPlugins,
    rehypePlugins,
  })
  const [locale, path] = document._meta.path.split(/[/\\]/)

  if (!locale || !path) {
    throw new Error(`Invalid path: ${document._meta.path}`)
  }

  // oxlint-disable-next-line no-deprecated -- false positive
  const fullPath = `${context.collection.directory}/${document._meta.filePath}`

  const lastModified = await context.cache(fullPath, async () => {
    try {
      const { stdout } = await x('git', ['log', '-1', `--format=%ai`, '--', fullPath])
      return safeDate(stdout.trim())
    } catch {
      return new Date().toISOString()
    }
  })

  const date = await context.cache(`${fullPath}:date`, async () => {
    try {
      const { stdout } = await x('git', ['log', '--diff-filter=A', '--follow', `--format=%ai`, '--', fullPath])
      return safeDate(stdout.trim())
    } catch {
      return new Date().toISOString()
    }
  })

  // oxlint-disable-next-line no-deprecated -- false positive
  const opengraphSegments = [context.collection.name, path, 'image.png']

  return {
    ...document,
    code,
    locale,
    slug: path,
    date,
    lastModified,
    toc: await getTOC(document.content),
    opengraphImage: {
      segments: opengraphSegments,
      url: `/og/${opengraphSegments.join('/')}`,
    },
  }
}

const posts = defineCollection({
  name: 'posts',
  directory: 'src/content/blog',
  include: '**/*.mdx',
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    content: z.string(),
  }),
  transform,
})

const projects = defineCollection({
  name: 'projects',
  directory: 'src/content/projects',
  include: '**/*.mdx',
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    homepage: z.string().optional(),
    github: z.string().optional(),
    techstack: z.array(z.string()).optional().default([]),
    selected: z.boolean().optional().default(false),
    dateCreated: z.string().optional(),
    content: z.string(),
  }),
  transform,
})

const pages = defineCollection({
  name: 'pages',
  directory: 'src/content/pages',
  include: '**/*.mdx',
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    content: z.string(),
  }),
  transform,
})

export default defineConfig({
  content: [posts, projects, pages],
})