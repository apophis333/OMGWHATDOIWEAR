import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import './Wardrobe.css'

function Wardrobe({ pieces, updatePieces }) {
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    category: 'Clothing Item',
    tags: '',
    photo: null,
    photoUrl: ''
  })

  const filteredPieces = pieces.filter(piece => {
    const matchesSearch = piece.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         piece.tags.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'All' || piece.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const handleAddPiece = () => {
    setEditingId(null)
    setFormData({ name: '', category: 'Clothing Item', tags: '', photo: null, photoUrl: '' })
    setShowModal(true)
  }

  const handleEditPiece = (piece) => {
    setEditingId(piece.id)
    setFormData({
      name: piece.name,
      category: piece.category,
      tags: piece.tags,
      photo: null,
      photoUrl: piece.photoUrl
    })
    setShowModal(true)
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          photoUrl: event.target.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Please enter a name')
      return
    }

    if (editingId) {
      updatePieces(pieces.map(p =>
        p.id === editingId
          ? { ...p, ...formData }
          : p
      ))
    } else {
      const newPiece = {
        id: Date.now(),
        ...formData
      }
      updatePieces([...pieces, newPiece])
    }

    setShowModal(false)
  }

  const handleDelete = (id) => {
    if (confirm('Delete this piece?')) {
      updatePieces(pieces.filter(p => p.id !== id))
    }
  }

  return (
    <div className="page">
      <PageHeader 
        title="Wardrobe"
        subtitle={`${pieces.length} pieces in your collection`}
        actionButton={
          <button className="btn-primary" onClick={handleAddPiece}>
            + Add piece
          </button>
        }
      />

      <div className="wardrobe-content">
        <div className="wardrobe-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-buttons">
            {['All', 'Outfits', 'Clothing', 'Accessories'].map(category => (
              <button
                key={category}
                className={`filter-btn ${filterCategory === category ? 'active' : ''}`}
                onClick={() => setFilterCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {filteredPieces.length === 0 ? (
          <div className="empty-state">
            <p>Your wardrobe is empty.</p>
            <button className="btn-secondary" onClick={handleAddPiece}>
              + Add your first piece
            </button>
          </div>
        ) : (
          <div className="pieces-grid">
            {filteredPieces.map(piece => (
              <div key={piece.id} className="piece-card">
                {piece.photoUrl && (
                  <div className="piece-photo">
                    <img src={piece.photoUrl} alt={piece.name} />
                  </div>
                )}
                <div className="piece-info">
                  <h3>{piece.name}</h3>
                  <p className="category">{piece.category}</p>
                  {piece.tags && <p className="tags">{piece.tags}</p>}
                  <div className="piece-actions">
                    <button className="btn-small" onClick={() => handleEditPiece(piece)}>Edit</button>
                    <button className="btn-small-danger" onClick={() => handleDelete(piece.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? 'Edit piece' : 'Add a piece'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="form-section">
                <label>Photo</label>
                <div className="photo-upload">
                  {formData.photoUrl ? (
                    <div className="photo-preview">
                      <img src={formData.photoUrl} alt="preview" />
                      <button type="button" onClick={() => setFormData(prev => ({ ...prev, photoUrl: '' }))}>Change</button>
                    </div>
                  ) : (
                    <div className="photo-placeholder">
                      <span>📷</span>
                      <p>Take or upload photo</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    style={{ display: 'none' }}
                    id="photo-input"
                  />
                  <label htmlFor="photo-input" style={{ cursor: 'pointer' }}>Click to upload</label>
                </div>
              </div>

              <div className="form-section">
                <label>Name</label>
                <input
                  type="text"
                  placeholder="e.g. Linen blazer"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="form-section">
                <label>Category</label>
                <div className="category-buttons">
                  {['Outfit', 'Clothing Item', 'Accessory'].map(cat => (
                    <button
                      key={cat}
                      className={`category-btn ${formData.category === cat ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <label>Tags</label>
                <input
                  type="text"
                  placeholder="e.g. summer, formal..."
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSave}>{editingId ? 'Update piece' : 'Add piece'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Wardrobe
