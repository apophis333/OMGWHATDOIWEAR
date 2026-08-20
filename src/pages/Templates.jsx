import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import './Templates.css'

const CLOTHING_SLOTS = [
  'Hat', 'Top', 'Jacket', 'Sweater', 'Skirt', 'Jeans', 'Pants',
  'Tall Shoes', 'Flat Shoes', 'Bag', 'Jewelry', 'Scarf', 'Belt', 'Custom'
]

const normalizeTags = (tags) => Array.isArray(tags)
  ? tags
  : (tags || '').split(',').map(tag => tag.trim()).filter(Boolean)

function Templates({ templates, updateTemplates, wardrobePieces }) {
  const [showModal, setShowModal] = useState(false)
  const [filterType, setFilterType] = useState('All')
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    type: 'Outfit',
    name: '',
    description: '',
    tags: [],
    tagInput: '',
    slots: {},
    photoUrl: ''
  })
  const [selectedSlots, setSelectedSlots] = useState([])

  const filteredTemplates = templates.filter(t => {
    if (filterType === 'All') return true
    if (filterType === 'Outfits') return t.type === 'Outfit'
    if (filterType === 'Vibes') return t.type === 'Vibe'
  })

  const handleNewTemplate = () => {
    setEditingId(null)
    setFormData({
      type: 'Outfit',
      name: '',
      description: '',
      tags: [],
      tagInput: '',
      slots: {},
      photoUrl: ''
    })
    setSelectedSlots([])
    setShowModal(true)
  }

  const handleEditTemplate = (template) => {
    setEditingId(template.id)
    setFormData({
      type: template.type,
      name: template.name,
      description: template.description,
      tags: normalizeTags(template.tags),
      tagInput: '',
      slots: template.slots || {},
      photoUrl: template.photoUrl || ''
    })
    setSelectedSlots(Object.keys(template.slots || {}))
    setShowModal(true)
  }

  const toggleSlot = (slot) => {
    setSelectedSlots(prev =>
      prev.includes(slot)
        ? prev.filter(s => s !== slot)
        : [...prev, slot]
    )
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

    const slots = {}
    const { tagInput, ...templateData } = formData
    selectedSlots.forEach(slot => {
      slots[slot] = formData.slots[slot] || null
    })

    if (editingId) {
      updateTemplates(templates.map(t =>
        t.id === editingId
          ? { ...templateData, id: editingId, slots }
          : t
      ))
    } else {
      const newTemplate = {
        id: Date.now(),
        ...templateData,
        slots
      }
      updateTemplates([...templates, newTemplate])
    }

    setShowModal(false)
  }

  const handleDelete = (id) => {
    if (confirm('Delete this template?')) {
      updateTemplates(templates.filter(t => t.id !== id))
    }
  }

  return (
    <div className="page">
      <PageHeader 
        title="Templates & Vibes"
        subtitle={`${templates.length} composed looks`}
        actionButton={
          <button className="btn-primary" onClick={handleNewTemplate}>
            + New template
          </button>
        }
      />

      <div className="templates-content">
        <div className="templates-filter">
          <div className="filter-buttons">
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
        </div>

        {filteredTemplates.length === 0 ? (
          <div className="empty-state">
            <p>No templates yet.</p>
            <button className="btn-secondary" onClick={handleNewTemplate}>
              + Create one
            </button>
          </div>
        ) : (
          <div className="templates-grid">
            {filteredTemplates.map(template => (
              <div key={template.id} className="template-card">
                {template.photoUrl && (
                  <div className="template-photo">
                    <img src={template.photoUrl} alt={template.name} />
                  </div>
                )}
                <div className="template-info">
                  <h3>{template.name}</h3>
                  <p className="type">{template.type}</p>
                  {template.description && <p className="description">{template.description}</p>}
                  {normalizeTags(template.tags).length > 0 && (
                    <div className="tags">
                      {normalizeTags(template.tags).map(tag => <span key={tag} className="tag-chip">{tag}</span>)}
                    </div>
                  )}
                  <div className="template-actions">
                    <button className="btn-small" onClick={() => handleEditTemplate(template)}>Edit</button>
                    <button className="btn-small-danger" onClick={() => handleDelete(template.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>New template</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="type-tabs">
                {['Outfit', 'Vibe'].map(type => (
                  <button
                    key={type}
                    className={`type-tab ${formData.type === type ? 'active' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, type }))}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="form-section">
                <label>Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sunday brunch look"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="form-section">
                <label>Description</label>
                <textarea
                  placeholder="Describe the vibe..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows="3"
                />
              </div>

              <div className="form-section">
                <label>Tags</label>
                <input
                  type="text"
                  value={formData.tagInput}
                  placeholder={formData.tags.length ? 'Add another tag' : 'Type a tag and press Enter'}
                  onChange={(e) => setFormData(prev => ({ ...prev, tagInput: e.target.value }))}
                  onKeyDown={handleTagKeyDown}
                  onBlur={addTag}
                />
                <div className="form-tags">
                  {formData.tags.map(tag => (
                    <span key={tag} className="tag-chip editable">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} aria-label={`Remove ${tag}`}>x</button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <label>Slots (pick one from each when you wear it)</label>
                <div className="slots-grid">
                  {CLOTHING_SLOTS.map(slot => (
                    <button
                      key={slot}
                      className={`slot-btn ${selectedSlots.includes(slot) ? 'active' : ''}`}
                      onClick={() => toggleSlot(slot)}
                    >
                      + {slot}
                    </button>
                  ))}
                </div>
                <p className="slots-hint">Add slots like Hat, Top, Jacket, Jeans...</p>
              </div>

              <div className="form-section">
                <label>Photos of you wearing it</label>
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
                    id="template-photo-input"
                  />
                  <label htmlFor="template-photo-input" style={{ cursor: 'pointer' }}>Click to upload</label>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSave}>Create template</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Templates
