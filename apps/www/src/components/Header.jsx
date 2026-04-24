import React, { useEffect, useState } from 'react'

const Header = () => {
  const [socialOpen, setSocialOpen] = useState(false)

  useEffect(() => {
    if (!socialOpen) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSocialOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [socialOpen])

  return (
    <header className="flex justify-between items-center px-8 lg:px-16 py-5 flex-shrink-0 bg-black">
      {/* Logo */}
      <div className="flex items-center">
        <img src="/assets/logo.svg" alt="Logo" className="h-[1.6rem] w-auto" />
      </div>

      {/* Navigation */}
      <nav className="flex items-center gap-6 lg:gap-10 hover-container relative">
        {/* Media button hidden for now */}
        {/* <a href="#" className="text-white/80 hover:text-white transition-colors text-sm lg:text-base hoverable">
          Media
        </a> */}
        <a href="https://docs.cli.cloud/" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors text-sm lg:text-base hoverable">
          Docs
        </a>
        
        {/* Social Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setSocialOpen(!socialOpen)}
            aria-expanded={socialOpen}
            aria-haspopup="menu"
            aria-controls="social-menu"
            className="text-white/80 hover:text-white transition-colors flex items-center gap-1 text-sm lg:text-base hoverable"
          >
            Social
            <span className="text-xs opacity-60">▼</span>
          </button>
          
          {/* Dropdown Menu */}
          {socialOpen && (
            <>
              {/* Backdrop to close on outside click */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setSocialOpen(false)}
                aria-hidden="true"
              />
              
              {/* Dropdown Content */}
              <div
                id="social-menu"
                role="menu"
                className="absolute right-0 top-full mt-2 bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg p-3 z-50 min-w-[120px]"
              >
                <a
                  href="https://x.com/clidotcloud"
                  target="_blank"
                  rel="noopener noreferrer"
                  role="menuitem"
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
                  onClick={() => setSocialOpen(false)}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span>X</span>
                </a>
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header
