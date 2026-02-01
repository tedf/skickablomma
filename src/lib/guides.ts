import fs from 'fs'
import path from 'path'

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
 * Konverterar Markdown till enkel HTML
 * (Enkel implementation - kan bytas mot remark/rehype senare)
 */
export function markdownToHtml(markdown: string): string {
  let html = markdown

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

  // Lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')

  // Links
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')

  // Paragraphs (enkel version)
  html = html.split('\n\n').map(para => {
    if (para.match(/^<[h|u|o|t]/)) return para
    if (para.trim() === '') return ''
    if (para.match(/^\|/)) return para // Tables
    if (para.startsWith('---')) return '<hr />'
    return `<p>${para}</p>`
  }).join('\n')

  // Tables (basic support)
  html = html.replace(/\|(.+)\|/g, (match) => {
    const cells = match.split('|').filter(c => c.trim())
    return '<tr>' + cells.map(c => `<td>${c.trim()}</td>`).join('') + '</tr>'
  })
  html = html.replace(/(<tr>.*<\/tr>\n?)+/g, '<table class="guide-table">$&</table>')

  return html
}
