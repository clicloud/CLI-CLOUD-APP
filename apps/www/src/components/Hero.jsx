/* eslint-disable react/prop-types */
const Hero = ({ onStartDeploy }) => {
  return (
    <section className="flex flex-shrink-0 items-start px-6 py-8 sm:px-8 lg:px-16 lg:py-10 mt-[7vh] sm:mt-[9vh] lg:mt-[10vh]" aria-label="Hero section">
      <div className="max-w-[34rem] space-y-5 sm:space-y-6">
        <p className="inline-flex rounded-full border border-[#EA5600]/35 bg-[#EA5600]/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#FF8A4A]">
          Zero-knowledge cloud
        </p>
        <h1 className="text-3xl font-semibold leading-[1.05] tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-[3.6rem]">
          The zero-knowledge platform<br />
          transforming cloud computing.
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-white/72 sm:text-lg lg:text-xl" aria-label="Tagline">
          Privacy isn&apos;t optional.
        </p>
        <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:items-center sm:pt-4">
          <button
            type="button"
            onClick={onStartDeploy}
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#EA5600] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#EA5600]/20 transition-all duration-150 hover:bg-[#FF6A1A] hover:shadow-[#EA5600]/30 active:scale-[0.98] sm:text-base hoverable"
          >
            Start Deploying
          </button>
          <a
            href="https://docs.cli.cloud/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/20 bg-black/30 px-6 py-3 text-sm font-medium text-white/82 backdrop-blur-sm transition-all duration-150 hover:border-white/35 hover:bg-white/8 hover:text-white active:scale-[0.98] sm:text-base hoverable"
          >
            Read Docs
          </a>
        </div>
        <div className="grid max-w-xl grid-cols-1 gap-2 border-t border-white/12 pt-5 text-sm text-white/58 sm:grid-cols-3 sm:gap-4">
          <span>Template catalog</span>
          <span>Private by default</span>
          <span>Live URL preview</span>
        </div>
      </div>
    </section>
  )
}

export default Hero
