import type { LeafletVersion, Medication } from '../data/types'

export type ChangeType = 'added' | 'changed' | 'removed'

export interface LeafletChange {
  /** Paragraph id — the same id is used in both leaflet versions. */
  id: string
  type: ChangeType
  sectionId: string
  sectionTitle: string
  previousText: string | null
  currentText: string | null
  explanation: string | null
}

export interface SectionChanges {
  sectionId: string
  sectionTitle: string
  changes: LeafletChange[]
}

/**
 * Compare two leaflet versions paragraph by paragraph.
 * Paragraphs are matched by id:
 *  - only in current  -> "added"
 *  - only in previous -> "removed"
 *  - in both, text differs -> "changed"
 */
export function compareLeaflets(
  previous: LeafletVersion,
  current: LeafletVersion,
  explanations: Record<string, string> = {},
): LeafletChange[] {
  const changes: LeafletChange[] = []

  // Ordered list of section ids: current order first, then sections that only exist in previous.
  const sectionIds = [
    ...current.sections.map((s) => s.id),
    ...previous.sections.map((s) => s.id).filter((id) => !current.sections.some((s) => s.id === id)),
  ]

  for (const sectionId of sectionIds) {
    const prevSection = previous.sections.find((s) => s.id === sectionId)
    const currSection = current.sections.find((s) => s.id === sectionId)
    const sectionTitle = (currSection ?? prevSection)!.title
    const prevParas = prevSection?.paragraphs ?? []
    const currParas = currSection?.paragraphs ?? []

    const explain = (id: string) => explanations[id] ?? null

    for (const para of currParas) {
      const old = prevParas.find((p) => p.id === para.id)
      if (!old) {
        changes.push({ id: para.id, type: 'added', sectionId, sectionTitle, previousText: null, currentText: para.text, explanation: explain(para.id) })
      } else if (normalize(old.text) !== normalize(para.text)) {
        changes.push({ id: para.id, type: 'changed', sectionId, sectionTitle, previousText: old.text, currentText: para.text, explanation: explain(para.id) })
      }
    }
    for (const old of prevParas) {
      if (!currParas.some((p) => p.id === old.id)) {
        changes.push({ id: old.id, type: 'removed', sectionId, sectionTitle, previousText: old.text, currentText: null, explanation: explain(old.id) })
      }
    }
  }
  return changes
}

/** Changes between the previous and current leaflet. Empty if there is no previous version. */
export function compareMedication(med: Medication): LeafletChange[] {
  if (!med.previous) return []
  return compareLeaflets(med.previous, med.current, med.explanations)
}

export function groupBySection(changes: LeafletChange[]): SectionChanges[] {
  const groups: SectionChanges[] = []
  for (const c of changes) {
    let g = groups.find((x) => x.sectionId === c.sectionId)
    if (!g) {
      g = { sectionId: c.sectionId, sectionTitle: c.sectionTitle, changes: [] }
      groups.push(g)
    }
    g.changes.push(c)
  }
  return groups
}

export function countByType(changes: LeafletChange[]): Record<ChangeType, number> {
  return {
    added: changes.filter((c) => c.type === 'added').length,
    changed: changes.filter((c) => c.type === 'changed').length,
    removed: changes.filter((c) => c.type === 'removed').length,
  }
}

function normalize(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

// ---------- Word-level diff (for showing old vs. new text inline) ----------

export interface DiffPart {
  kind: 'same' | 'inserted' | 'deleted'
  text: string
}

/** Longest-common-subsequence diff on words. Leaflet paragraphs are short, so O(n*m) is fine. */
export function wordDiff(oldText: string, newText: string): DiffPart[] {
  const a = tokenize(oldText)
  const b = tokenize(newText)
  const n = a.length
  const m = b.length
  const lcs: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0))
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1])
    }
  }

  const parts: DiffPart[] = []
  const push = (kind: DiffPart['kind'], text: string) => {
    const last = parts[parts.length - 1]
    if (last && last.kind === kind) last.text += text
    else parts.push({ kind, text })
  }

  let i = 0
  let j = 0
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      push('same', a[i])
      i++
      j++
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      push('deleted', a[i++])
    } else {
      push('inserted', b[j++])
    }
  }
  while (i < n) push('deleted', a[i++])
  while (j < m) push('inserted', b[j++])
  return parts
}

/** Split into words and whitespace runs, so joining parts gives back the original text exactly. */
function tokenize(text: string): string[] {
  return text.match(/\s+|\S+/g) ?? []
}
