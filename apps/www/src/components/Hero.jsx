import React from 'react'

const Hero = () => {
  return (
    <section className="flex items-start px-8 lg:px-16 py-4 lg:py-6 flex-shrink-0 mt-[10vh]" aria-label="Hero section">
      {/* Upper Left Content - Wider text box to prevent cutting */}
      <div className="space-y-3 max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
        <h1 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-medium leading-snug tracking-normal text-white">
          The zero-knowledge platform<br />
          transforming cloud computing.
        </h1>
        <p className="text-xs sm:text-sm lg:text-base text-white/60 italic" aria-label="Tagline">
          Privacy isn't optional.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <a
            href="https://app.cli.cloud/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-white text-black font-medium rounded hover:bg-white/90 transition-all duration-300 text-sm lg:text-base inline-flex items-center justify-center hoverable"
            style={{ boxShadow: '0 0 40px 8px rgba(255, 255, 255, 0.15)' }}
          >
            Launch App
          </a>
          <a
            href="https://docs.cli.cloud/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-white/20 text-white/80 font-medium rounded hover:bg-white/5 hover:text-white transition-all duration-300 text-sm lg:text-base inline-flex items-center justify-center hoverable"
          >
            Read Docs
          </a>
        </div>
      </div>
    </section>
  )
}

export default Hero
