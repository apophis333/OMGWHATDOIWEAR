import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import './Wheel.css'

const FILTERS = ['All', 'Outfits', 'Vibes', 'Custom']
const SEGMENT_COLORS = ['#d9b7a6', '#b6c8bf', '#d7c6a3', '#c4b7cc', '#c9aeb1', '#b7c2d1']

function Wheel({ templates, wearHistory, updateWearHistory, onCreateTemplate }) {
  const [filterType, setFilterType] = useState('All')
  const [selectedOutfit, setSelectedOutfit] = useState(null)
  const [showWearModal, setShowWearModal] = useState(false)
  const [wearNotes, setWearNotes] = useState('')
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)

  const filteredTemplates = templates.filter(t => {
    if (filterType === 'All') return true
    if (filterType === 'Outfits') return t.type === 'Outfit'
    if (filterType === 'Vibes') return t.type === 'Vibe'
    if (filterType === 'Custom') return t.type === 'Custom'
  })

  const handleSpin = () => {
    if (isSpinning || filteredTemplates.length === 0) return
    const randomIndex = Math.floor(Math.random() * filteredTemplates.length)
    const segmentAngle = 360 / filteredTemplates.length
    const segmentCenter = (randomIndex + 0.5) * segmentAngle
    const randomOffset = (Math.random() - 0.5) * segmentAngle * 0.7
    const targetRotation = (360 - segmentCenter + randomOffset + 360) % 360
    const currentRotation = ((rotation % 360) + 360) % 360
    const rotationToTarget = (targetRotation - currentRotation + 360) % 360
    const randomFullTurns = 4 + Math.floor(Math.random() * 4)

    setIsSpinning(true)
    setSelectedOutfit(null)
    setShowWearModal(false)
    setRotation(previous => previous + randomFullTurns * 360 + rotationToTarget)
    window.setTimeout(() => {
      const outfit = filteredTemplates[randomIndex]
      setSelectedOutfit(outfit)
      setWearNotes('')
      setIsSpinning(false)
    }, 1200)
  }

  const wheelStyle = {
    '--wheel-segments': filteredTemplates.length
      ? `conic-gradient(${filteredTemplates.map((_, index) => `${SEGMENT_COLORS[index % SEGMENT_COLORS.length]} ${index * (100 / filteredTemplates.length)}% ${(index + 1) * (100 / filteredTemplates.length)}%`).join(', ')})`
      : '#e8e0d9',
    transform: `rotate(${rotation}deg)`
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
            {FILTERS.map(type => (
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
            <p className="secondary">Create a template, then spin to choose a look.</p>
            <button className="btn-secondary" onClick={onCreateTemplate}>
              + Create a template
            </button>
          </div>
        ) : (
          <div className="wheel-section">
            <div className="wheel-stage">
              <div className="wheel-pointer" aria-hidden="true">▼</div>
              <div className={`visual-wheel ${isSpinning ? 'spinning' : ''}`} style={wheelStyle}>
                {filteredTemplates.map((template, index) => (
                  <span
                    key={template.id}
                    className="wheel-label"
                    style={{ transform: `rotate(${index * (360 / filteredTemplates.length) + (180 / filteredTemplates.length)}deg) translateY(-112px)` }}
                  >
                    {template.name.length > 15 ? `${template.name.slice(0, 15)}...` : template.name}
                  </span>
                ))}
                <div className="wheel-center">{isSpinning ? '...' : '🎲'}</div>
              </div>
              <button className="btn-spin" onClick={handleSpin} disabled={isSpinning}>
                {isSpinning ? 'CHOOSING...' : 'SPIN THE WHEEL'}
              </button>
            </div>
            {selectedOutfit && !isSpinning && (
              <div className="outfit-display">
                <p className="result-kicker">YOUR LOOK</p>
                {selectedOutfit.photoUrl && <img src={selectedOutfit.photoUrl} alt={selectedOutfit.name} />}
                {!selectedOutfit.photoUrl && <div className="result-placeholder">🎲</div>}
                <h2>{selectedOutfit.name}</h2>
                <p>{selectedOutfit.type} · Ready to wear</p>
                <button className="btn-primary" onClick={() => setShowWearModal(true)}>Log this wear</button>
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
