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
 * Konverterar Markdown till HTML.
 * Hanterar: rubriker, paragrafer, listor, fetstil, kursiv, länkar, horisontella linjer.
 */
export function markdownToHtml(markdown: string): string {
  function inlineFormat(text: string): string {
    // Fetstil + kursiv
    text = text.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    // Fetstil
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Kursiv
    text = text.replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Länk
    text = text.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    // Kod (inline)
    text = text.replace(/`(.+?)`/g, '<code>$1</code>')
    return text
  }

  const lines = markdown.split('\n')
  const output: string[] = []
  let inList = false
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Horisontell linje
    if (/^---+$/.test(line.trim())) {
      if (inList) { output.push('</ul>'); inList = false }
      output.push('<hr />')
      i++
      continue
    }

    // Rubriker
    const h3 = line.match(/^### (.+)$/)
    if (h3) {
      if (inList) { output.push('</ul>'); inList = false }
      output.push(`<h3>${inlineFormat(h3[1])}</h3>`)
      i++
      continue
    }
    const h2 = line.match(/^## (.+)$/)
    if (h2) {
      if (inList) { output.push('</ul>'); inList = false }
      output.push(`<h2>${inlineFormat(h2[1])}</h2>`)
      i++
      continue
    }
    const h1 = line.match(/^# (.+)$/)
    if (h1) {
      if (inList) { output.push('</ul>'); inList = false }
      output.push(`<h1>${inlineFormat(h1[1])}</h1>`)
      i++
      continue
    }

    // Listrad
    const li = line.match(/^[-*] (.+)$/)
    if (li) {
      if (!inList) { output.push('<ul>'); inList = true }
      output.push(`<li>${inlineFormat(li[1])}</li>`)
      i++
      continue
    }

    // Tom rad – avsluta lista
    if (line.trim() === '') {
      if (inList) { output.push('</ul>'); inList = false }
      i++
      continue
    }

    // Paragraf – samla ihop konsekutiva icke-tomma, icke-spec rader
    if (inList) { output.push('</ul>'); inList = false }
    const paraLines: string[] = []
    while (i < lines.length && lines[i].trim() !== '' && !lines[i].match(/^#{1,3} /) && !lines[i].match(/^[-*] /) && !lines[i].match(/^---+$/)) {
      paraLines.push(lines[i])
      i++
    }
    if (paraLines.length > 0) {
      output.push(`<p>${inlineFormat(paraLines.join(' '))}</p>`)
    }
  }

  if (inList) output.push('</ul>')

  return output.join('\n')
}
