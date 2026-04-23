import React from 'react'

const Partners = () => {
  const logos = [
    '/partners/Rectangle-39.png',
    '/partners/Rectangle-39-1.png',
    '/partners/Rectangle-40.png',
    '/partners/Rectangle-40-1.png',
    '/partners/Rectangle-42.png',
    '/partners/Rectangle-43.png',
    '/partners/Rectangle-44.png',
    '/partners/Group-1991423932.png',
    '/partners/Group-1991423933.png',
    '/partners/Group-1991423934.png',
    '/partners/Group-1991423966.png',
    '/partners/Mask-group.png',
    '/partners/Mask-group-1.png',
  ]

  return (
    <div 
      className="w-full sm:w-3/4 lg:w-1/2 relative overflow-hidden partners-container ml-8 lg:ml-16 mb-8 py-2"
      style={{
        maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)'
      }}
    >
      {/* Scrolling logos container */}
      <div className="partners-track flex items-center gap-12 py-4">
        {/* First set of logos */}
        {logos.map((logo, index) => (
          <img 
            key={`logo-1-${index}`}
            src={logo} 
            alt={`Partner ${index + 1}`}
            className="h-8 lg:h-10 w-auto flex-shrink-0 partner-logo grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
          />
        ))}
        {/* Duplicate set for seamless loop */}
        {logos.map((logo, index) => (
          <img 
            key={`logo-2-${index}`}
            src={logo} 
            alt={`Partner ${index + 1}`}
            className="h-8 lg:h-10 w-auto flex-shrink-0 partner-logo grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
          />
        ))}
      </div>
    </div>
  )
}

export default Partners

