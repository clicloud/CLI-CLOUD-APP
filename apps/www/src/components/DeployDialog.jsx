import React, { useState, useRef, useEffect } from 'react'

const TEMPLATES = [
  {
    id: 'web-app',
    title: 'Web App',
    description: 'Next.js — Full-stack React framework',
    icon: '🌐',
    runtime: 'Node.js 20',
    port: 3000,
    repo: 'clicloud/nextjs-starter',
  },
  {
    id: 'ai-backend',
    title: 'AI Backend',
    description: 'FastAPI — Python API with SQLite',
    icon: '🧠',
    runtime: 'Python 3.11',
    port: 8000,
    repo: 'clicloud/fastapi-starter',
  },
  {
    id: 'chat-bot',
    title: 'Chat Bot',
    description: 'Telegram Bot — Persistent process',
    icon: '🤖',
    runtime: 'Python 3.11',
    port: null,
    repo: 'clicloud/telegram-bot-starter',
  },
  {
    id: 'simple-site',
    title: 'Simple Site',
    description: 'Static HTML — Deploy in 60 seconds',
    icon: '📄',
    runtime: 'Nginx',
    port: 80,
    repo: 'clicloud/static-starter',
  },
  {
    id: 'api-server',
    title: 'API Server',
    description: 'Express.js — Node.js REST API',
    icon: '⚡',
    runtime: 'Node.js 20',
    port: 3000,
    repo: 'clicloud/express-starter',
  },
]

const DeployDialog = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('select') // select | configure | deploying | done
  const [selected, setSelected] = useState(null)
  const [projectName, setProjectName] = useState('')
  const [containerId, setContainerId] = useState(null)
  const dialogRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setStep('select')
      setSelected(null)
      setProjectName('')
      setContainerId(null)
    }
  }, [isOpen])

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSelect = (template) => {
    setSelected(template)
    setStep('configure')
  }

  const handleDeploy = () => {
    setStep('deploying')
    // Simulate deployment — replace with real API call to CLI backend
    setTimeout(() => {
      setContainerId('cli-' + Math.random().toString(36).substring(2, 10))
      setStep('done')
    }, 2500)
  }

  const slugify = (name) =>
    name.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        className="relative w-full max-w-lg mx-4 bg-[#111118] border border-white/10 rounded-xl overflow-hidden shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Deploy a container"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-white text-lg font-medium">
            {step === 'select' && 'Choose a template'}
            {step === 'configure' && `Configure ${selected?.title}`}
            {step === 'deploying' && 'Deploying...'}
            {step === 'done' && 'Deployed!'}
          </h2>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {step === 'select' && (
            <div className="space-y-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleSelect(t)}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-lg border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all text-left group"
                >
                  <span className="text-2xl">{t.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium text-sm">{t.title}</div>
                    <div className="text-white/40 text-xs">{t.description}</div>
                  </div>
                  <span className="text-white/20 group-hover:text-white/60 transition-colors text-sm">→</span>
                </button>
              ))}
            </div>
          )}

          {step === 'configure' && selected && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-lg">
                <span className="text-2xl">{selected.icon}</span>
                <div>
                  <div className="text-white font-medium text-sm">{selected.title}</div>
                  <div className="text-white/40 text-xs">{selected.runtime} {selected.port ? `· Port ${selected.port}` : '· Long-running'}</div>
                </div>
              </div>

              <div>
                <label className="block text-white/60 text-xs mb-1.5" htmlFor="project-name">
                  Project name
                </label>
                <input
                  id="project-name"
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="my-awesome-app"
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
                  autoFocus
                />
                {projectName && (
                  <div className="text-white/30 text-xs mt-1">
                    Will be available at {slugify(projectName)}.cli.cloud
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('select')}
                  className="px-4 py-2.5 border border-white/10 text-white/60 rounded-lg text-sm hover:bg-white/5 transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleDeploy}
                  disabled={projectName.length < 3}
                  className="flex-1 px-4 py-2.5 bg-white text-black font-medium rounded-lg text-sm hover:bg-white/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Deploy
                </button>
              </div>
            </div>
          )}

          {step === 'deploying' && (
            <div className="flex flex-col items-center py-8 space-y-4">
              <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <div className="text-white/60 text-sm">
                Provisioning container...
              </div>
            </div>
          )}

          {step === 'done' && containerId && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <span className="text-emerald-400 text-lg">✓</span>
                <div>
                  <div className="text-white font-medium text-sm">Container deployed</div>
                  <div className="text-white/40 text-xs">ID: {containerId}</div>
                </div>
              </div>
              <div className="text-white/40 text-xs">
                Register or log in to claim this container and manage it from your dashboard.
              </div>
              <div className="flex gap-3">
                <a
                  href="https://app.cli.cloud/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-2.5 bg-white text-black font-medium rounded-lg text-sm hover:bg-white/90 transition-all text-center"
                >
                  Open Dashboard
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 border border-white/10 text-white/60 rounded-lg text-sm hover:bg-white/5 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DeployDialog
