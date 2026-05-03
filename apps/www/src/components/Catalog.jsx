import React from 'react'

const templates = [
  {
    name: 'Web App',
    stack: 'Next.js',
    port: '3000',
    description: 'Full-stack React framework with API routes, SSR, and static generation.',
  },
  {
    name: 'AI Backend',
    stack: 'FastAPI + SQLite',
    port: '8000',
    description: 'Python API starter for AI and LLM app backends with persistent storage.',
  },
  {
    name: 'Chat Bot',
    stack: 'Telegram Bot',
    port: 'Worker',
    description: 'Long-running Python bot process with logs, exec, and metrics support.',
  },
  {
    name: 'Simple Site',
    stack: 'Static HTML',
    port: '80',
    description: 'The fastest path to prove the platform works: one static site deploy.',
  },
  {
    name: 'API Server',
    stack: 'Express.js',
    port: '3000',
    description: 'Node.js API starter for JavaScript developers building backend services.',
  },
  {
    name: 'OpenClaw',
    stack: 'Custom Container',
    port: '8080',
    description: 'Pre-configured custom container path for self-hosted applications.',
  },
]

const Catalog = () => {
  return (
    <section className="bg-black border-t border-white/20 px-8 lg:px-16 py-12 lg:py-16" aria-labelledby="catalog-heading">
      <div className="mb-8 max-w-2xl">
        <p className="mb-3 text-xs uppercase tracking-[0.35em] text-white/40">Deployable templates</p>
        <h2 id="catalog-heading" className="text-3xl lg:text-5xl font-light leading-tight text-white">
          Start from a real container, not a blank screen.
        </h2>
        <p className="mt-4 text-sm lg:text-base leading-relaxed text-white/50">
          Pick a starter, configure resources, and launch on CLI without handing control to a traditional cloud.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/15 bg-white/15 hover-container">
        {templates.map((template) => (
          <article key={template.name} className="group bg-black p-6 lg:p-7 transition-all duration-300 hover:bg-white/[0.04] hoverable">
            <div className="mb-8 flex items-center justify-between gap-4">
              <span className="rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/50">
                {template.stack}
              </span>
              <span className="font-mono text-xs text-white/35">:{template.port}</span>
            </div>

            <h3 className="text-2xl font-light text-white">{template.name}</h3>
            <p className="mt-3 min-h-[4.5rem] text-sm leading-relaxed text-white/50">{template.description}</p>

            <a
              href="https://app.cli.cloud/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Deploy ${template.name}`}
              className="mt-8 inline-flex items-center text-sm font-medium text-white/70 transition-colors duration-300 group-hover:text-white"
            >
              Deploy template
              <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Catalog
