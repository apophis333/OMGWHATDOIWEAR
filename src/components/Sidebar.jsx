import './Sidebar.css'

function Sidebar({ currentPage, onPageChange }) {
  return (
    <aside className="sidebar">
      <div className="logo">
        <h1>What's My Style</h1>
      </div>
      
      <nav className="nav-menu">
        <button
          className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}
          onClick={() => onPageChange('home')}
        >
          <span className="icon">🏠</span>
          Home
        </button>
        
        <button
          className={`nav-item ${currentPage === 'wardrobe' ? 'active' : ''}`}
          onClick={() => onPageChange('wardrobe')}
        >
          <span className="icon">👕</span>
          Wardrobe
        </button>
        
        <button
          className={`nav-item ${currentPage === 'templates' ? 'active' : ''}`}
          onClick={() => onPageChange('templates')}
        >
          <span className="icon">✨</span>
          Templates
        </button>
        
        <button
          className={`nav-item ${currentPage === 'folders' ? 'active' : ''}`}
          onClick={() => onPageChange('folders')}
        >
          <span className="icon">📁</span>
          Folders
        </button>
        
        <button
          className={`nav-item ${currentPage === 'wheel' ? 'active' : ''}`}
          onClick={() => onPageChange('wheel')}
        >
          <span className="icon">🎡</span>
          IDK WHAT TO WEAR?!
        </button>

        <button
          className={`nav-item ${currentPage === 'statistics' ? 'active' : ''}`}
          onClick={() => onPageChange('statistics')}
        >
          <span className="icon">📊</span>
          Statistics
        </button>
      </nav>
    </aside>
  )
}

export default Sidebar
