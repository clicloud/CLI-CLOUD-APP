/* eslint-disable react/prop-types */
const Features = ({ onStartDeploy }) => {
  return (
    <section className="flex-shrink-0 border-t border-white/12 bg-[#070707]" aria-label="Three Pillars of Infrastructure">
      <div className="px-6 py-8 sm:px-8 lg:px-16 lg:py-10">
        <div 
          className="grid grid-cols-1 gap-4 overflow-hidden sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 features-grid hover-container"
          role="list"
        >
          <article className="relative rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-b before:from-white/[0.03] before:to-transparent hover:border-[#EA5600]/30 hover:bg-white/[0.06] hover:shadow-lg hover:shadow-[#EA5600]/5 sm:p-6 lg:rounded-none lg:border-0 lg:border-r lg:border-dashed lg:border-white/20 lg:bg-transparent lg:p-8 feature-card hoverable" role="listitem">
            <div className="relative">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#FF8A4A]">Security</p>
              <h2 className="mb-3 text-xl font-semibold tracking-tight text-white lg:text-2xl">Sovereign Infrastructure</h2>
              <p className="text-base leading-relaxed text-white/58">
                Hardware-root-of-trust. Zero telemetry. Cryptographic verification from silicon to stack.
              </p>
            </div>
          </article>

          <article className="relative rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-b before:from-white/[0.03] before:to-transparent hover:border-[#EA5600]/30 hover:bg-white/[0.06] hover:shadow-lg hover:shadow-[#EA5600]/5 sm:p-6 lg:rounded-none lg:border-0 lg:border-r lg:border-dashed lg:border-white/20 lg:bg-transparent lg:p-8 feature-card hoverable" role="listitem">
            <div className="relative">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#FF8A4A]">Reliability</p>
              <h2 className="mb-3 text-xl font-semibold tracking-tight text-white lg:text-2xl">Resilient & Uncensorable</h2>
              <p className="text-base leading-relaxed text-white/58">
                Distributed nodes across jurisdictions. No single point of failure. Immutable and unstoppable.
              </p>
            </div>
          </article>

          <article className="relative rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-b before:from-white/[0.03] before:to-transparent hover:border-[#EA5600]/30 hover:bg-white/[0.06] hover:shadow-lg hover:shadow-[#EA5600]/5 sm:p-6 lg:rounded-none lg:border-0 lg:border-r lg:border-dashed lg:border-white/20 lg:bg-transparent lg:p-8 feature-card hoverable" role="listitem">
            <div className="relative">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#FF8A4A]">Compute</p>
              <h2 className="mb-3 text-xl font-semibold tracking-tight text-white lg:text-2xl">Universal GPU Access</h2>
              <p className="text-base leading-relaxed text-white/58">
                Aggregated GPU marketplace. Multi-LLM orchestration. Enterprise power, permissionless access.
              </p>
            </div>
          </article>

          <div className="flex flex-col items-start justify-center rounded-xl border border-[#EA5600]/20 bg-[#EA5600]/8 p-5 transition-all duration-300 hover:shadow-lg hover:shadow-[#EA5600]/10 sm:p-6 lg:items-center lg:rounded-none lg:border-0 lg:bg-transparent lg:p-8 feature-card hoverable">
            <button
              type="button"
              onClick={onStartDeploy}
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#EA5600] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#EA5600]/20 transition-all duration-150 hover:bg-[#FF6A1A] hover:shadow-[#EA5600]/30 active:scale-[0.98] lg:text-base"
            >
              Start Deploying
            </button>
            <p className="mt-3 text-sm leading-relaxed text-white/50 lg:text-center">
              Open the catalog and preview a deploy.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features
