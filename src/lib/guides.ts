import fs from 'fs'
import path from 'path'
import { marked } from 'marked'

export interface Guide {
  slug: string
  title: string
  content: string
  excerpt?: string
}

const guidesDirectory = path.join(process.cwd(), 'content/guides')

/**
 * Hämtar alla guider
 */
export function getAllGuides(): Guide[] {
  const fileNames = fs.readdirSync(guidesDirectory)

  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '')
      const guide = getGuideBySlug(slug)
      return guide
    })
    .filter((guide): guide is Guide => guide !== null)
}

/**
 * Hämtar en guide baserat på slug
 */
export function getGuideBySlug(slug: string): Guide | null {
  try {
    const fullPath = path.join(guidesDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Extrahera title från första # heading
    const titleMatch = fileContents.match(/^#\s+(.+)$/m)
    const title = titleMatch ? titleMatch[1] : slug

    // Extrahera excerpt från första paragrafen efter titeln
    const excerptMatch = fileContents.match(/^#\s+.+\n\n(.+)$/m)
    const excerpt = excerptMatch ? excerptMatch[1] : undefined

    return {
      slug,
      title,
      content: fileContents,
      excerpt,
    }
  } catch (error) {
    return null
  }
}

/**
 * Konverterar Markdown till HTML med marked-biblioteket.
 */
export function markdownToHtml(markdown: string): string {
  return marked.parse(markdown, { async: false }) as string
}
