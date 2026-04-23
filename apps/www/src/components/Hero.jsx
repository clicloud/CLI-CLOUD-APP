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
      </div>
    </section>
  )
}

export default Hero

