import PageHeader from '../components/PageHeader'
import './Home.css'

function Home({ data, onNavigate }) {
  const wardrobePieces = data.wardrobePieces || []
  const templates = data.templates || []
  const wearHistory = data.wearHistory || []

  return (
    <div className="page">
      <PageHeader 
        title="Welcome back"
      />
      
      <div className="home-content">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{wardrobePieces.length}</div>
            <div className="stat-label">Wardrobe Pieces</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">{templates.length}</div>
            <div className="stat-label">Templates</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">0</div>
            <div className="stat-label">Folders</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">{wearHistory.length}</div>
            <div className="stat-label">Total Wears</div>
          </div>
        </div>

        <div className="quick-actions">
          <div 
            className="action-card"
            onClick={() => onNavigate('wardrobe')}
          >
            <div className="action-icon" aria-hidden="true">W</div>
            <h3>Wardrobe</h3>
            <p>Photograph and catalog every piece.</p>
          </div>

          <div 
            className="action-card"
            onClick={() => onNavigate('templates')}
          >
            <div className="action-icon" aria-hidden="true">T</div>
            <h3>Templates & Vibes</h3>
            <p>Compose looks from your pieces.</p>
          </div>

          <div 
            className="action-card"
            onClick={() => onNavigate('wheel')}
          >
            <div className="action-icon" aria-hidden="true">R</div>
            <h3>IDK WHAT TO WEAR?!</h3>
            <p>Can't decide? Let fate pick your look.</p>
          </div>
        </div>

        <div className="breakdown">
          <h3>Breakdown</h3>
          <div className="breakdown-items">
            <div className="breakdown-item">
              <span>Outfit templates</span>
              <span className="value">{templates.filter(t => t.type === 'outfit').length}</span>
            </div>
            <div className="breakdown-item">
              <span>Vibe templates</span>
              <span className="value">{templates.filter(t => t.type === 'vibe').length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
