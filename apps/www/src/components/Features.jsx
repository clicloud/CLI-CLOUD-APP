import React from 'react'

const Features = () => {
  return (
    <section className="flex-shrink-0 bg-black border-t border-white/20" aria-label="Three Pillars of Infrastructure">
      {/* Solid black background - video doesn't show through */}
      <div className="px-8 lg:px-16 py-6 lg:py-8">
        {/* Desktop: bordered grid / Mobile: no borders, stacked */}
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 overflow-hidden features-grid hover-container"
          role="list"
        >
          {/* Feature Card 1 */}
          <article className="bg-transparent py-4 px-0 sm:p-6 lg:p-8 mb-3 sm:mb-0 transition-all duration-300 hover:bg-white/5 feature-card feature-card-border hoverable" role="listitem">
            <h2 className="text-xl lg:text-2xl font-light mb-3 text-white">Sovereign Infrastructure</h2>
            <p className="text-sm lg:text-base text-white/50 leading-relaxed">
              Hardware-root-of-trust. Zero telemetry. Cryptographic verification from silicon to stack.
            </p>
          </article>

          {/* Feature Card 2 */}
          <article className="bg-transparent py-4 px-0 sm:p-6 lg:p-8 mb-3 sm:mb-0 transition-all duration-300 hover:bg-white/5 feature-card feature-card-border hoverable" role="listitem">
            <h2 className="text-xl lg:text-2xl font-light mb-3 text-white">Resilient & Uncensorable</h2>
            <p className="text-sm lg:text-base text-white/50 leading-relaxed">
              Distributed nodes across jurisdictions. No single point of failure. Immutable and unstoppable.
            </p>
          </article>

          {/* Feature Card 3 */}
          <article className="bg-transparent py-4 px-0 sm:p-6 lg:p-8 mb-3 sm:mb-0 transition-all duration-300 hover:bg-white/5 feature-card feature-card-border hoverable" role="listitem">
            <h2 className="text-xl lg:text-2xl font-light mb-3 text-white">Universal GPU Access</h2>
            <p className="text-sm lg:text-base text-white/50 leading-relaxed">
              Aggregated GPU marketplace. Multi-LLM orchestration. Enterprise power, permissionless access.
            </p>
          </article>

          {/* CLI App Launch Section */}
          <div className="bg-transparent py-4 px-0 sm:p-6 lg:p-8 transition-all duration-300 feature-card flex flex-col justify-center items-start lg:items-center hoverable">
            <a 
              href="https://app.cli.cloud/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white text-black font-medium rounded hover:bg-white/90 transition-all duration-300 text-sm lg:text-base inline-block"
              style={{ boxShadow: '0 0 40px 8px rgba(255, 255, 255, 0.15)' }}
            >
              Launch App →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features

