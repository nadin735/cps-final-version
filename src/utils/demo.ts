import type { Project, Task } from '../types'

// Fictional sample projects for "Try with demo data — no login".
// Names and figures are illustrative only.

function tasks(rows: [string, string, number, string[]][]): Task[] {
  return rows.map(([id, name, duration, dependencies]) => ({ id, name, duration, dependencies }))
}

export function demoProjects(): Project[] {
  const now = new Date().toISOString()
  return [
    {
      id: crypto.randomUUID(),
      name: 'Demo: ERP-Migration (fiktiv)',
      createdAt: now,
      updatedAt: now,
      sourcePdfNames: [],
      tasks: tasks([
        ['A', 'Kick-off & Projektauftrag', 3, []],
        ['B', 'Ist-Analyse Prozesse', 10, ['A']],
        ['C', 'Datenbereinigung Altsystem', 15, ['A']],
        ['D', 'Soll-Konzept & Fit-Gap', 12, ['B']],
        ['E', 'Systemkonfiguration', 20, ['D']],
        ['F', 'Schnittstellen entwickeln', 18, ['D']],
        ['G', 'Datenmigration Testlauf', 6, ['C', 'E']],
        ['H', 'Integrationstest', 10, ['F', 'G']],
        ['I', 'Anwenderschulung', 8, ['E']],
        ['J', 'Go-live & Hypercare', 5, ['H', 'I']],
      ]),
    },
    {
      id: crypto.randomUUID(),
      name: 'Demo: Website-Relaunch (fiktiv)',
      createdAt: now,
      updatedAt: now,
      sourcePdfNames: [],
      tasks: tasks([
        ['A', 'Anforderungen & Zielgruppen', 4, []],
        ['B', 'Informationsarchitektur', 5, ['A']],
        ['C', 'Content-Erstellung', 15, ['B']],
        ['D', 'UI-Design', 10, ['B']],
        ['E', 'Frontend-Entwicklung', 12, ['D']],
        ['F', 'CMS-Einrichtung', 6, ['B']],
        ['G', 'Content-Einpflege', 5, ['C', 'E', 'F']],
        ['H', 'QA & Barrierefreiheit', 4, ['G']],
        ['I', 'Launch', 1, ['H']],
      ]),
    },
  ]
}
