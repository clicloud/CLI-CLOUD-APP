/* eslint-disable react/prop-types */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const templates = [
  {
    id: 'web-app',
    name: 'Web App',
    stack: 'Next.js',
    description: 'Full-stack React framework with SSR and API routes.',
    suggestedEnv: [],
  },
  {
    id: 'ai-backend',
    name: 'AI Backend',
    stack: 'FastAPI',
    description: 'Python API template for AI and LLM applications.',
    suggestedEnv: ['OPENAI_API_KEY'],
  },
  {
    id: 'chat-bot',
    name: 'Chat Bot',
    stack: 'Python',
    description: 'Telegram bot container ready for message handling.',
    suggestedEnv: ['BOT_TOKEN'],
  },
  {
    id: 'simple-site',
    name: 'Simple Site',
    stack: 'Static HTML',
    description: 'The fastest deploy. One HTML file, live in seconds.',
    recommended: true,
    suggestedEnv: [],
  },
  {
    id: 'api-server',
    name: 'API Server',
    stack: 'Express.js',
    description: 'Node.js API with one endpoint for backend services.',
    suggestedEnv: ['API_SECRET'],
  },
  {
    id: 'openclaw',
    name: 'OpenClaw',
    stack: 'Custom',
    description: 'Pre-configured self-hosted application container.',
    suggestedEnv: ['ADMIN_EMAIL'],
  },
]

const deployStages = [
  { label: 'Preparing container...', progress: 20 },
  { label: 'Building from template...', progress: 55 },
  { label: 'Starting application...', progress: 82 },
  { label: 'Running health check...', progress: 100 },
]

const slugPattern = /^[a-z0-9]([a-z0-9-]{1,28}[a-z0-9])?$/

function DeployDialog({ open, onOpenChange }) {
  const [step, setStep] = useState('select')
  const [selectedId, setSelectedId] = useState('simple-site')
  const [projectName, setProjectName] = useState('')
  const [envOpen, setEnvOpen] = useState(false)
  const [envVars, setEnvVars] = useState([])
  const [stageIndex, setStageIndex] = useState(0)
  const [copied, setCopied] = useState(false)
  const dialogRef = useRef(null)

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === selectedId) || templates[0],
    [selectedId]
  )

  const projectError = projectName && !slugPattern.test(projectName)
    ? 'Use 3-30 lowercase letters, numbers, and hyphens.'
    : ''

  const projectUrl = projectName
    ? `https://${projectName}.cli.cloud`
    : 'https://your-project.cli.cloud'

  const resetDialog = useCallback(() => {
    setStep('select')
    setSelectedId('simple-site')
    setProjectName('')
    setEnvOpen(false)
    setEnvVars([])
    setStageIndex(0)
    setCopied(false)
  }, [])

  const closeDialog = useCallback(() => {
    resetDialog()
    onOpenChange(false)
  }, [onOpenChange, resetDialog])

  useEffect(() => {
    if (!open) {
      return undefined
    }

    const previousActiveElement = document.activeElement
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && step !== 'deploying') {
        closeDialog()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    window.setTimeout(() => dialogRef.current?.focus(), 0)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousActiveElement?.focus?.()
    }
  }, [closeDialog, open, step])

  useEffect(() => {
    if (step !== 'deploying') {
      return undefined
    }

    const timers = deployStages.map((_, index) => (
      window.setTimeout(() => setStageIndex(index), index * 850)
    ))
    const successTimer = window.setTimeout(() => setStep('success'), 3600)

    return () => {
      timers.forEach(window.clearTimeout)
      window.clearTimeout(successTimer)
    }
  }, [step])

  if (!open) {
    return null
  }

  const canDeploy = projectName && !projectError

  const handleTemplateSelect = (id) => {
    const nextTemplate = templates.find((template) => template.id === id)
    setSelectedId(id)
    setEnvVars(nextTemplate?.suggestedEnv.map((key) => ({ key, value: '' })) || [])
    setEnvOpen(Boolean(nextTemplate?.suggestedEnv.length))
  }

  const addEnvVar = () => {
    setEnvOpen(true)
    setEnvVars((current) => [...current, { key: '', value: '' }])
  }

  const updateEnvVar = (index, field, value) => {
    setEnvVars((current) => current.map((envVar, envIndex) => (
      envIndex === index ? { ...envVar, [field]: value } : envVar
    )))
  }

  const removeEnvVar = (index) => {
    setEnvVars((current) => current.filter((_, envIndex) => envIndex !== index))
  }

  const copyUrl = async () => {
    await navigator.clipboard?.writeText(projectUrl)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 px-4 py-4 backdrop-blur-sm sm:items-center sm:px-6" role="presentation">
      <button
        type="button"
        aria-label="Close deploy dialog"
        className="absolute inset-0 cursor-default"
        onClick={() => step !== 'deploying' && closeDialog()}
      />

      <section
        ref={dialogRef}
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="deploy-dialog-title"
        className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/15 bg-[#101010] shadow-2xl shadow-black/50 outline-none"
      >
        <div className="sticky top-0 z-10 border-b border-white/10 bg-[#101010]/95 px-5 py-4 backdrop-blur sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#EA5600]">Deploy</p>
              <h2 id="deploy-dialog-title" className="mt-1 text-2xl font-semibold tracking-tight text-white">
                Start a container
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-white/60">
                Choose a template, name the project, and preview the launch flow.
              </p>
            </div>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/60 transition-colors hover:border-white/25 hover:text-white"
              onClick={() => step !== 'deploying' && closeDialog()}
              disabled={step === 'deploying'}
              aria-label="Close dialog"
            >
              X
            </button>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-2" aria-hidden="true">
            {['select', 'configure', 'deploying', 'success'].map((name, index) => {
              const activeIndex = ['select', 'configure', 'deploying', 'success'].indexOf(step)
              return (
                <span
                  key={name}
                  className={`h-1 rounded-full ${index <= activeIndex ? 'bg-[#EA5600]' : 'bg-white/12'}`}
                />
              )
            })}
          </div>
        </div>

        {step === 'select' && (
          <div className="px-5 py-6 sm:px-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => (
                <button
                  type="button"
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  className={`min-h-40 rounded-xl border p-4 text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-[#EA5600] hover:shadow-lg hover:shadow-[#EA5600]/10 ${
                    selectedId === template.id
                      ? 'border-[#EA5600] bg-[#EA5600]/10 shadow-lg shadow-[#EA5600]/10'
                      : 'border-white/10 bg-white/[0.03]'
                  }`}
                >
                  <span className="flex items-start justify-between gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/8 text-lg font-semibold text-white">
                      {template.name.slice(0, 2)}
                    </span>
                    {template.recommended && (
                      <span className="rounded-full border border-[#EA5600]/30 px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-[#FF8A4A]">
                        Recommended
                      </span>
                    )}
                  </span>
                  <span className="mt-4 block text-lg font-semibold text-white">{template.name}</span>
                  <span className="mt-1 block text-xs font-semibold uppercase tracking-wider text-white/45">{template.stack}</span>
                  <span className="mt-3 block text-sm leading-relaxed text-white/60">{template.description}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="rounded-lg border border-white/15 px-5 py-3 text-sm font-medium text-white/70 transition-all duration-150 hover:border-white/30 hover:text-white"
                onClick={closeDialog}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-lg bg-[#EA5600] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#EA5600]/15 transition-all duration-150 hover:bg-[#FF6A1A] hover:shadow-[#EA5600]/25 active:scale-[0.98]"
                onClick={() => setStep('configure')}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 'configure' && (
          <form
            className="px-5 py-6 sm:px-6"
            onSubmit={(event) => {
              event.preventDefault()
              if (canDeploy) {
                setStageIndex(0)
                setStep('deploying')
              }
            }}
          >
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/45">Selected template</p>
              <div className="mt-3 flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#EA5600]/15 text-lg font-semibold text-white">
                  {selectedTemplate.name.slice(0, 2)}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedTemplate.name}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/60">{selectedTemplate.description}</p>
                </div>
              </div>
            </div>

            <label className="mt-6 block text-sm font-medium text-white" htmlFor="project-name">
              Project name
            </label>
            <input
              id="project-name"
              value={projectName}
              onChange={(event) => setProjectName(event.target.value.toLowerCase())}
              placeholder="my-awesome-project"
              aria-describedby="project-name-help"
              className="mt-2 w-full rounded-lg border border-white/15 bg-black/35 px-4 py-3 text-base text-white outline-none transition-colors placeholder:text-white/25 focus:border-[#EA5600]"
            />
            <p id="project-name-help" className={`mt-2 text-sm ${projectError ? 'text-red-400' : 'text-white/50'}`}>
              {projectError || `Your project will be live at: ${projectUrl}`}
            </p>

            <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02]">
              <button
                type="button"
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-white"
                onClick={() => setEnvOpen(!envOpen)}
                aria-expanded={envOpen}
              >
                <span>Environment variables</span>
                <span className="text-white/45">{envOpen ? 'Hide' : 'Add optional'}</span>
              </button>

              {envOpen && (
                <div className="space-y-3 border-t border-white/10 p-4">
                  {envVars.map((envVar, index) => (
                    <div key={`${envVar.key}-${index}`} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                      <input
                        value={envVar.key}
                        onChange={(event) => updateEnvVar(index, 'key', event.target.value.toUpperCase())}
                        placeholder="API_KEY"
                        className="min-h-11 rounded-lg border border-white/15 bg-black/35 px-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#EA5600]"
                        aria-label={`Environment variable ${index + 1} key`}
                      />
                      <input
                        value={envVar.value}
                        onChange={(event) => updateEnvVar(index, 'value', event.target.value)}
                        placeholder="Value"
                        type="password"
                        className="min-h-11 rounded-lg border border-white/15 bg-black/35 px-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#EA5600]"
                        aria-label={`Environment variable ${index + 1} value`}
                      />
                      <button
                        type="button"
                        className="min-h-11 rounded-lg border border-white/15 px-3 text-sm text-white/65 transition-colors hover:text-white"
                        onClick={() => removeEnvVar(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-white/75 transition-colors hover:border-white/30 hover:text-white"
                    onClick={addEnvVar}
                  >
                    Add variable
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="rounded-lg border border-white/15 px-5 py-3 text-sm font-medium text-white/70 transition-all duration-150 hover:border-white/30 hover:text-white"
                onClick={() => setStep('select')}
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!canDeploy}
                className="rounded-lg bg-[#EA5600] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#EA5600]/15 transition-all duration-150 hover:bg-[#FF6A1A] hover:shadow-[#EA5600]/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-white/40 disabled:shadow-none"
              >
                Deploy
              </button>
            </div>
          </form>
        )}

        {step === 'deploying' && (
          <div className="px-5 py-14 text-center sm:px-6" aria-live="polite">
            <div className="mx-auto h-14 w-14 animate-spin rounded-full border-2 border-white/15 border-t-[#EA5600]" />
            <h3 className="mt-6 text-2xl font-semibold tracking-tight text-white">{deployStages[stageIndex].label}</h3>
            <div className="mx-auto mt-5 h-2 max-w-md overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[#EA5600] transition-all duration-500"
                style={{ width: `${deployStages[stageIndex].progress}%` }}
              />
            </div>
            <p className="mt-4 text-sm text-white/55">This usually takes under 60 seconds.</p>
          </div>
        )}

        {step === 'success' && (
          <div className="px-5 py-10 text-center sm:px-6" aria-live="polite">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/12 text-2xl text-emerald-300">
              OK
            </div>
            <h3 className="mt-6 text-2xl font-semibold tracking-tight text-white">Your project is live</h3>
            <p className="mt-2 text-sm text-white/55">{projectName}</p>
            <div className="mt-6 flex flex-col gap-3 rounded-xl border border-white/10 bg-black/35 p-3 sm:flex-row sm:items-center">
              <code className="flex-1 overflow-x-auto text-left text-sm text-white/80">{projectUrl}</code>
              <button
                type="button"
                className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-white/75 transition-colors hover:text-white"
                onClick={copyUrl}
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                className="rounded-lg border border-white/15 px-5 py-3 text-sm font-medium text-white/70 transition-all duration-150 hover:border-white/30 hover:text-white"
                onClick={() => {
                  setProjectName('')
                  setStep('select')
                }}
              >
                Deploy another
              </button>
              <a
                href="https://app.cli.cloud/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-[#EA5600] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#EA5600]/15 transition-all duration-150 hover:bg-[#FF6A1A] hover:shadow-[#EA5600]/25"
              >
                Go to project
              </a>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default DeployDialog
