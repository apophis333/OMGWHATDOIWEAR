import { useState } from 'react'
import './Sidebar.css'

function Sidebar({ currentPage, onPageChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = page => {
    onPageChange(page)
    setIsOpen(false)
  }

  return (
    <>
      <button className="mobile-menu-button" onClick={() => setIsOpen(true)} aria-label="Open navigation">☰</button>
      {isOpen && <button className="sidebar-overlay" onClick={() => setIsOpen(false)} aria-label="Close navigation" />}
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="logo">
        <div className="logo-row"><h1>What's My Style</h1><button className="sidebar-close" onClick={() => setIsOpen(false)} aria-label="Close navigation">×</button></div>
      </div>
      
      <nav className="nav-menu">
        <button
          className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}
          onClick={() => navigate('home')}
        >
          <span className="icon" aria-hidden="true">🏠</span>
          Home
        </button>
        
        <button
          className={`nav-item ${currentPage === 'wardrobe' ? 'active' : ''}`}
          onClick={() => navigate('wardrobe')}
        >
          <span className="icon" aria-hidden="true">👕</span>
          Wardrobe
        </button>
        
        <button
          className={`nav-item ${currentPage === 'templates' ? 'active' : ''}`}
          onClick={() => navigate('templates')}
        >
          <span className="icon" aria-hidden="true">✨</span>
          Templates
        </button>
        
        <button
          className={`nav-item ${currentPage === 'folders' ? 'active' : ''}`}
          onClick={() => navigate('folders')}
        >
          <span className="icon" aria-hidden="true">📁</span>
          Folders
        </button>
        
        <button
          className={`nav-item ${currentPage === 'wheel' ? 'active' : ''}`}
          onClick={() => navigate('wheel')}
        >
          <span className="icon" aria-hidden="true">🎡</span>
          IDK WHAT TO WEAR?!
        </button>

        <button
          className={`nav-item ${currentPage === 'statistics' ? 'active' : ''}`}
          onClick={() => navigate('statistics')}
        >
          <span className="icon" aria-hidden="true">📊</span>
          Statistics
        </button>
      </nav>
    </aside>
    </>
  )
}

export default Sidebar
