import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import './Wardrobe.css'

const normalizeTags = (tags) => Array.isArray(tags)
  ? tags
  : (tags || '').split(',').map(tag => tag.trim()).filter(Boolean)

function Wardrobe({ pieces, updatePieces }) {
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    category: 'Clothing Item',
    tags: [],
    tagInput: '',
    photo: null,
    photoUrl: ''
  })

  const filteredPieces = pieces.filter(piece => {
    const pieceTags = normalizeTags(piece.tags)
    const matchesSearch = piece.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               pieceTags.join(' ').toLowerCase().includes(searchTerm.toLowerCase())
    const categoryMap = { Outfits: 'Outfit', Clothing: 'Clothing Item', Accessories: 'Accessory' }
    const matchesCategory = filterCategory === 'All' || piece.category === categoryMap[filterCategory]
    return matchesSearch && matchesCategory
  })

  const handleAddPiece = () => {
    setEditingId(null)
    setFormData({ name: '', category: 'Clothing Item', tags: [], tagInput: '', photo: null, photoUrl: '' })
    setShowModal(true)
  }

  const handleEditPiece = (piece) => {
    setEditingId(piece.id)
    setFormData({
      name: piece.name,
      category: piece.category,
      tags: normalizeTags(piece.tags),
      tagInput: '',
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

  const addTag = () => {
    const tag = formData.tagInput.trim()
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag], tagInput: '' }))
    }
  }

  const handleTagKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      addTag()
    }
  }

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Please enter a name')
      return
    }

    const { tagInput, ...pieceData } = formData

    if (editingId) {
      updatePieces(pieces.map(p =>
        p.id === editingId
          ? { ...p, ...pieceData }
          : p
      ))
    } else {
      const newPiece = {
        id: Date.now(),
        ...pieceData
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
                  {normalizeTags(piece.tags).length > 0 && (
                    <div className="tags">
                      {normalizeTags(piece.tags).map(tag => <span key={tag} className="tag-chip">{tag}</span>)}
                    </div>
                  )}
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
                      <span className="camera-mark" aria-hidden="true">+</span>
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
                <div className="tag-input-shell">
                  {formData.tags.map(tag => (
                    <span key={tag} className="tag-chip editable">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} aria-label={`Remove ${tag}`}>x</button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder={formData.tags.length ? 'Add another tag' : 'Type a tag and press Enter'}
                    value={formData.tagInput}
                    onChange={(e) => setFormData(prev => ({ ...prev, tagInput: e.target.value }))}
                    onKeyDown={handleTagKeyDown}
                    onBlur={addTag}
                  />
                </div>
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
