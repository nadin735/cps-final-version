import { useEffect, useState } from 'react'
import type { Project, Task } from './types'
import { dict, isRtl, Lang } from './i18n'
import { WORKSPACE, purgeLegacyAccounts, deleteAllLocalData } from './utils/account'
import { loadPortfolio, upsertProject, deleteProject, newProject } from './utils/portfolio'
import { demoProjects } from './utils/demo'
import LegalModal, { type LegalPage } from './components/LegalModal'
import ConfirmDialog from './components/ConfirmDialog'
import PortfolioDashboard from './components/PortfolioDashboard'
import AddProjectModal from './components/AddProjectModal'
import ProjectResultScreen from './components/ProjectResultScreen'

const THEME_KEY = 'cps-theme-v1'

const PORTFOLIO_URL = 'https://projektmanagement.nadin.dev'
const accountKey = WORKSPACE

// Runs once per page load, before the first render reads storage.
purgeLegacyAccounts()

function readTheme(): 'night' | 'day' {
  try {
    return (sessionStorage.getItem(THEME_KEY) as 'night' | 'day') ?? 'night'
  } catch {
    return 'night'
  }
}

const LANG_LABEL: Record<Lang, string> = { de: 'DE', en: 'EN', ar: 'AR' }

export default function App() {
  const [lang, setLang] = useState<Lang>('de')
  const t = dict[lang]
  const rtl = isRtl[lang]

  const [theme, setTheme] = useState<'night' | 'day'>(readTheme)
  const [projects, setProjects] = useState<Project[]>(() => loadPortfolio(accountKey))
  const [legalPage, setLegalPage] = useState<LegalPage | null>(null)
  const [confirmWipe, setConfirmWipe] = useState(false)
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    document.documentElement.dir = rtl ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [lang, rtl])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      sessionStorage.setItem(THEME_KEY, theme)
    } catch {
      /* private mode */
    }
  }, [theme])

  const activeProject = activeProjectId ? projects.find((p) => p.id === activeProjectId) ?? null : null

  const handleAddComplete = (tasks: Task[], targetProjectId: string | null, pdfName: string | null) => {
    if (targetProjectId) {
      const existing = projects.find((p) => p.id === targetProjectId)
      if (existing) {
        const updated: Project = {
          ...existing,
          tasks: [...existing.tasks, ...tasks],
          sourcePdfNames: pdfName ? [...existing.sourcePdfNames, pdfName] : existing.sourcePdfNames,
          updatedAt: new Date().toISOString(),
        }
        const next = upsertProject(accountKey, updated)
        setProjects(next)
        setActiveProjectId(updated.id)
      }
    } else {
      const name = pdfName?.replace(/\.pdf$/i, '') || `${t.newProject} ${new Date().toLocaleDateString()}`
      const project = newProject(name, tasks, pdfName ? [pdfName] : [])
      const next = upsertProject(accountKey, project)
      setProjects(next)
      setActiveProjectId(project.id)
    }
    setShowAddModal(false)
  }

  const handleSaveResult = (tasks: Task[]) => {
    if (!activeProject) return
    const updated: Project = { ...activeProject, tasks, updatedAt: new Date().toISOString() }
    const next = upsertProject(accountKey, updated)
    setProjects(next)
  }

  const handleDeleteProject = (id: string) => setProjects(deleteProject(accountKey, id))

  const handleLoadDemo = () => {
    let next = projects
    for (const p of demoProjects()) next = upsertProject(accountKey, p)
    setProjects(next)
  }

  const handleWipe = () => {
    deleteAllLocalData()
    setProjects([])
    setActiveProjectId(null)
    setConfirmWipe(false)
  }

  return (
    <div className="min-h-screen scanlines">
      <header className="max-w-6xl mx-auto px-6 pt-10 pb-6 flex items-start justify-between gap-4 flex-wrap no-print">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Critical Path Scanner</h1>
          <a href={PORTFOLIO_URL} className="text-sm text-ink2 underline hover:text-gold-400">
            ← {t.allTools}
          </a>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={() => setTheme(theme === 'night' ? 'day' : 'night')}
            className="font-mono text-xs border border-fieldEdge rounded-full px-3 py-1.5 text-ink2 hover:border-gold-500 hover:text-gold-400 transition-colors"
          >
            {theme === 'night' ? '☾' : '☀'} {theme === 'night' ? t.nightMode : t.dayMode}
          </button>
          <div className="flex gap-1">
            {(Object.keys(LANG_LABEL) as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`font-mono text-xs border rounded-full px-3 py-1.5 transition-colors ${
                  lang === l ? 'border-gold-500 text-gold-400' : 'border-fieldEdge text-ink3 hover:text-ink hover:border-edge'
                }`}
              >
                {LANG_LABEL[l]}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-16">
        {activeProject ? (
          <ProjectResultScreen
            project={activeProject}
            allProjects={projects}
            rtl={rtl}
            lang={lang}
            onSave={handleSaveResult}
            onBack={() => setActiveProjectId(null)}
            t={t}
          />
        ) : (
          <PortfolioDashboard
            projects={projects}
            onOpen={(id) => setActiveProjectId(id)}
            onAdd={() => setShowAddModal(true)}
            onDemo={handleLoadDemo}
            onDelete={handleDeleteProject}
            t={t}
          />
        )}
      </main>

      <footer className="max-w-6xl mx-auto px-6 pb-10 text-sm text-ink2 no-print">
        <p className="mb-3">{t.localNote}</p>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          <button className="underline hover:text-gold-400" onClick={() => setLegalPage('imprint')}>{t.imprint}</button>
          <button className="underline hover:text-gold-400" onClick={() => setLegalPage('privacy')}>{t.privacy}</button>
          <button className="underline hover:text-gold-400" onClick={() => setConfirmWipe(true)}>{t.deleteAllData}</button>
          <a className="underline hover:text-gold-400" href={PORTFOLIO_URL}>{t.allTools}</a>
        </nav>
      </footer>

      {legalPage && (
        <LegalModal
          page={legalPage}
          appName="Critical Path Scanner"
          localProcessing="Hochgeladene PDFs werden direkt in Ihrem Browser ausgelesen und nicht hochgeladen."
          onClose={() => setLegalPage(null)}
          t={t}
        />
      )}
      {confirmWipe && (
        <ConfirmDialog message={t.confirmDeleteAll} danger onConfirm={handleWipe} onCancel={() => setConfirmWipe(false)} t={t} />
      )}

      {showAddModal && (
        <AddProjectModal projects={projects} onClose={() => setShowAddModal(false)} onComplete={handleAddComplete} t={t} />
      )}
    </div>
  )
}
