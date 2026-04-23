import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Partners from './components/Partners'
import Features from './components/Features'

function App() {
  const [videoLoaded, setVideoLoaded] = useState(false)

  return (
    <div className="relative w-screen min-h-screen bg-black main-container overflow-y-auto">
      {/* Video Background with Black & White Filter - Fixed */}
      <div className="fixed inset-0 z-0">
        {/* Poster Image - Shows while video loads */}
        {!videoLoaded && (
          <img 
            src="/poster.jpg" 
            alt="Background" 
            className="w-full h-full object-cover grayscale-filter"
          />
        )}
        
        {/* Video with optimized loading */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/poster.jpg"
          controls={false}
          disablePictureInPicture
          onLoadedData={() => setVideoLoaded(true)}
          style={{ pointerEvents: 'none' }}
          className={`w-full h-full object-cover grayscale-filter transition-opacity duration-500 video-background ${
            videoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          x-webkit-airplay="deny"
        >
          <source src="/BG.mp4" type="video/mp4" />
        </video>
        
        {/* Black Overlay - 80% Opacity, darkens to 85% on hover */}
        <div className="absolute inset-0 bg-black opacity-80 video-overlay transition-opacity duration-300" />
        
        {/* Vignette Effect - Dark edges fading to center */}
        <div className="absolute inset-0 vignette-overlay pointer-events-none" />
        
        {/* Pixel/Tech Grid Overlay */}
        <div className="absolute inset-0 pixel-overlay pointer-events-none" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header with transparent black background */}
        <Header />
        
        {/* Middle area - Hero at top, video visible */}
        <div className="flex-1 flex flex-col">
          {/* Hero at top left */}
          <Hero />
          
          {/* Spacer - minimal spacing */}
          <div className="flex-1 min-h-[5vh] sm:min-h-[10vh]" />
          
          {/* Partners logos slider - just above bottom boxes */}
          <Partners />
        </div>
        
        {/* Bottom Frame - Solid background, video doesn't show through */}
        <Features />
      </div>
    </div>
  )
}

export default App

