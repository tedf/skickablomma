import { AlertTriangle } from 'lucide-react'
import type { PublishIssue } from '@/lib/publishing'

interface DraftNoticeProps {
  issues: PublishIssue[]
}

/**
 * Syns bara i utvecklingsläge. Draft-sidor renderas lokalt så att copyn går att
 * läsa och granska, men genereras aldrig i produktionsbygget — se shouldRender.
 * Rutan listar exakt vad som saknas för att sidan ska få publiceras.
 */
export function DraftNotice({ issues }: DraftNoticeProps) {
  if (process.env.NODE_ENV === 'production') return null

  return (
    <div className="rounded-lg border border-signal-200 bg-signal-50 p-4 text-sm">
      <p className="flex items-center gap-2 font-semibold text-signal-700">
        <AlertTriangle className="h-4 w-4" aria-hidden />
        Utkast — publiceras inte
      </p>
      {issues.length > 0 ? (
        <ul className="mt-2 list-disc space-y-1 pl-5 text-signal-700">
          {issues.map((issue) => (
            <li key={`${issue.field}-${issue.message}`}>
              <code className="font-mono text-xs">{issue.field}</code>: {issue.message}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-signal-700">
          Inga hinder kvar. Sätt <code className="font-mono text-xs">status</code> till{' '}
          <code className="font-mono text-xs">published</code> i data-filen.
        </p>
      )}
    </div>
  )
}
