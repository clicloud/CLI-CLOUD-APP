import React from 'react'

const Logo3D = () => {
  return (
    <div className="relative flex items-center justify-center h-48 lg:h-64">
      {/* Halftone Background */}
      <div 
        className="absolute w-64 h-64 lg:w-80 lg:h-80 rounded-full animate-pulse-slow"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, transparent 20%, rgba(16, 185, 129, 0.1) 40%, transparent 70%)',
          backgroundImage: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 1px, transparent 1px)',
          backgroundSize: '8px 8px',
          maskImage: 'radial-gradient(circle at center, black 30%, transparent 65%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 65%)',
        }}
      />

      {/* 3D Logo Bars */}
      <div 
        className="relative flex gap-3 lg:gap-4"
        style={{
          transform: 'perspective(1000px) rotateX(-5deg) rotateY(15deg)',
          filter: 'drop-shadow(0 20px 40px rgba(16, 185, 129, 0.4))',
        }}
      >
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="relative w-10 h-20 lg:w-12 lg:h-24 animate-float"
            style={{
              background: 'linear-gradient(180deg, #ffffff 0%, #e0e0e0 100%)',
              animationDelay: `${index * 0.2}s`,
            }}
          >
            {/* Bottom Glow */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-8 lg:h-10"
              style={{
                background: 'linear-gradient(180deg, transparent 0%, rgba(16, 185, 129, 0.8) 100%)',
              }}
            />
            
            {/* Side Panel */}
            <div 
              className="absolute top-0 left-full w-5 h-full"
              style={{
                background: 'linear-gradient(90deg, rgba(0, 0, 0, 0.3) 0%, transparent 100%)',
                transformOrigin: 'left',
                transform: 'skewY(-45deg) scaleY(0.866)',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Logo3D

