import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import './Wheel.css'

function Wheel({ templates, wearHistory, updateWearHistory }) {
  const [filterType, setFilterType] = useState('All')
  const [selectedOutfit, setSelectedOutfit] = useState(null)
  const [showWearModal, setShowWearModal] = useState(false)
  const [wearNotes, setWearNotes] = useState('')

  const filteredTemplates = templates.filter(t => {
    if (filterType === 'All') return true
    if (filterType === 'Outfits') return t.type === 'Outfit'
    if (filterType === 'Vibes') return t.type === 'Vibe'
  })

  const getRandomOutfit = () => {
    if (filteredTemplates.length === 0) return null
    const randomIndex = Math.floor(Math.random() * filteredTemplates.length)
    return filteredTemplates[randomIndex]
  }

  const handleSpin = () => {
    const outfit = getRandomOutfit()
    setSelectedOutfit(outfit)
    setWearNotes('')
    if (outfit) {
      setShowWearModal(true)
    }
  }

  const handleLogWear = () => {
    if (selectedOutfit) {
      const wear = {
        id: Date.now(),
        templateId: selectedOutfit.id,
        templateName: selectedOutfit.name,
        date: new Date().toISOString(),
        notes: wearNotes
      }
      updateWearHistory([...wearHistory, wear])
      setShowWearModal(false)
      setSelectedOutfit(null)
      setWearNotes('')
    }
  }

  return (
    <div className="page">
      <PageHeader 
        title="IDK WHAT TO WEAR?!"
        subtitle="Can't decide? Let fate pick your look for the day."
      />

      <div className="wheel-content">
        <div className="wheel-controls">
          <div className="filter-buttons">
            <span className="filter-label">TYPE</span>
            {['All', 'Outfits', 'Vibes'].map(type => (
              <button
                key={type}
                className={`filter-btn ${filterType === type ? 'active' : ''}`}
                onClick={() => setFilterType(type)}
              >
                {type}
              </button>
            ))}
          </div>
          <p className="wheel-count">{filteredTemplates.length} options in the wheel</p>
        </div>

        {filteredTemplates.length === 0 ? (
          <div className="empty-state">
            <p>No options match your filters.</p>
            <p className="secondary">No templates yet.</p>
            <button className="btn-secondary">
              + Create a template
            </button>
          </div>
        ) : (
          <div className="wheel-section">
            {selectedOutfit ? (
              <div className="outfit-display">
                {selectedOutfit.photoUrl && (
                  <img src={selectedOutfit.photoUrl} alt={selectedOutfit.name} />
                )}
                <h2>{selectedOutfit.name}</h2>
                <p>{selectedOutfit.type}</p>
                <button className="btn-primary" onClick={handleSpin}>
                  Spin again
                </button>
              </div>
            ) : (
              <div className="wheel-empty">
                <div className="spinner-icon" aria-hidden="true">R</div>
                <button className="btn-spin" onClick={handleSpin}>
                  SPIN THE WHEEL
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {showWearModal && selectedOutfit && (
        <div className="modal-overlay" onClick={() => setShowWearModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Log this wear</h2>
              <button className="modal-close" onClick={() => setShowWearModal(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="wear-summary">
                <h3>{selectedOutfit.name}</h3>
                <p>{selectedOutfit.type}</p>
              </div>

              <div className="form-section">
                <label>Notes (optional)</label>
                <textarea
                  placeholder="How did you feel in this outfit? Any feedback?"
                  value={wearNotes}
                  onChange={(e) => setWearNotes(e.target.value)}
                  rows="4"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowWearModal(false)}>Skip</button>
              <button className="btn-primary" onClick={handleLogWear}>Log wear</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Wheel
