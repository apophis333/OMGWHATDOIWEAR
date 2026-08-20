import { useState } from 'react'
import './Folders.css'

function Folders({ folders, updateFolders, wardrobePieces, templates }) {
  const [selectedFolderId, setSelectedFolderId] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [folderName, setFolderName] = useState('')
  const [folderDescription, setFolderDescription] = useState('')
  const [boardView, setBoardView] = useState('All')
  const [boardSearch, setBoardSearch] = useState('')
  const [boardFilters, setBoardFilters] = useState({ season: 'All seasons', occasion: 'All occasions', color: 'All colors', category: 'All types' })
  const [draggedKey, setDraggedKey] = useState(null)

  const selectedFolder = folders.find(folder => folder.id === selectedFolderId)
  const folderPieces = selectedFolder
    ? wardrobePieces.filter(piece => (selectedFolder.pieceIds || []).includes(piece.id))
    : []
  const folderTemplates = selectedFolder
    ? templates.filter(template => (selectedFolder.templateIds || []).includes(template.id))
    : []
  const inspirations = selectedFolder?.inspirations || []
  const orderedKeys = selectedFolder?.itemOrder?.length
    ? selectedFolder.itemOrder
    : [...folderPieces.map(piece => `piece:${piece.id}`), ...folderTemplates.map(template => `template:${template.id}`), ...inspirations.map(item => `inspiration:${item.id}`)]
  const boardItems = orderedKeys.map(key => {
    const [type, id] = key.split(':')
    if (type === 'piece') return { key, type, item: folderPieces.find(piece => String(piece.id) === id) }
    if (type === 'template') return { key, type, item: folderTemplates.find(template => String(template.id) === id) }
    return { key, type, item: inspirations.find(inspiration => String(inspiration.id) === id) }
  }).filter(entry => entry.item)
  const visibleBoardItems = boardItems.filter(({ item, type }) => {
    const searchable = `${item.name || ''} ${item.notes || ''} ${item.tags || ''} ${item.color || ''} ${item.occasion || ''}`.toLowerCase()
    if (boardSearch && !searchable.includes(boardSearch.toLowerCase())) return false
    if (boardView === 'Favorites' && !item.favorite) return false
    if (boardView === 'Recent' && item.createdAt && Date.now() - new Date(item.createdAt).getTime() > 1000 * 60 * 60 * 24 * 30) return false
    if (boardFilters.season !== 'All seasons' && item.season !== boardFilters.season) return false
    if (boardFilters.occasion !== 'All occasions' && item.occasion !== boardFilters.occasion) return false
    if (boardFilters.color !== 'All colors' && item.color?.toLowerCase() !== boardFilters.color.toLowerCase()) return false
    if (boardFilters.category !== 'All types' && (item.category || item.type) !== boardFilters.category) return false
    return true
  })

  const createFolder = () => {
    if (!folderName.trim()) return
    const folder = {
      id: Date.now(),
      name: folderName.trim(),
      description: folderDescription.trim(),
      pieceIds: [],
      templateIds: [],
      inspirations: [],
      itemOrder: []
    }
    updateFolders([...folders, folder])
    setSelectedFolderId(folder.id)
    setFolderName('')
    setFolderDescription('')
    setShowCreateModal(false)
  }

  const addToFolder = (type, id) => {
    updateFolders(folders.map(folder => {
      if (folder.id !== selectedFolderId) return folder
      const key = type === 'piece' ? 'pieceIds' : 'templateIds'
      const ids = folder[key] || []
      const keyName = `${type}:${id}`
      return ids.includes(id) ? folder : { ...folder, [key]: [...ids, id], itemOrder: [...(folder.itemOrder || []), keyName] }
    }))
  }

  const removeFromFolder = (type, id) => {
    updateFolders(folders.map(folder => {
      if (folder.id !== selectedFolderId) return folder
      if (type === 'inspiration') {
        return { ...folder, inspirations: (folder.inspirations || []).filter(item => item.id !== id), itemOrder: (folder.itemOrder || []).filter(keyName => keyName !== `inspiration:${id}`) }
      }
      const key = type === 'piece' ? 'pieceIds' : 'templateIds'
      return { ...folder, [key]: (folder[key] || []).filter(itemId => itemId !== id), itemOrder: (folder.itemOrder || []).filter(keyName => keyName !== `${type}:${id}`) }
    }))
  }

  const reorderBoard = (fromKey, toKey) => {
    if (!fromKey || !toKey || fromKey === toKey) return
    updateFolders(folders.map(folder => {
      if (folder.id !== selectedFolderId) return folder
      const nextOrder = [...(folder.itemOrder || orderedKeys)]
      const fromIndex = nextOrder.indexOf(fromKey)
      const toIndex = nextOrder.indexOf(toKey)
      if (fromIndex < 0 || toIndex < 0) return folder
      nextOrder.splice(fromIndex, 1)
      nextOrder.splice(toIndex, 0, fromKey)
      return { ...folder, itemOrder: nextOrder }
    }))
  }

  const addInspiration = event => {
    const file = event.target.files?.[0]
    if (!file || !selectedFolderId) return
    const reader = new FileReader()
    reader.onload = loadEvent => updateFolders(folders.map(folder => {
      if (folder.id !== selectedFolderId) return folder
      const inspiration = { id: Date.now(), name: file.name.replace(/\.[^/.]+$/, ''), photoUrl: loadEvent.target.result, createdAt: new Date().toISOString(), favorite: false, notes: '' }
      return { ...folder, inspirations: [...(folder.inspirations || []), inspiration], itemOrder: [...(folder.itemOrder || orderedKeys), `inspiration:${inspiration.id}`] }
    }))
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  const deleteFolder = () => {
    if (!selectedFolder || !confirm(`Delete ${selectedFolder.name}?`)) return
    updateFolders(folders.filter(folder => folder.id !== selectedFolderId))
    setSelectedFolderId(null)
  }

  return (
    <div className="page">
      <div className="folders-header">
        <div>
          <p className="eyebrow">Your collections</p>
          <h1>Folders</h1>
          <p>Build visual boards for the things that inspire your style.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowCreateModal(true)}>+ New folder</button>
      </div>

      <div className="folders-content">
        <div className="folder-list">
          {folders.length === 0 ? (
            <div className="folder-list-empty">No folders yet.</div>
          ) : folders.map(folder => (
            <button
              key={folder.id}
              className={`folder-tile ${selectedFolderId === folder.id ? 'active' : ''}`}
              onClick={() => setSelectedFolderId(folder.id)}
            >
              <span className="folder-tile-mark" aria-hidden="true">+</span>
              <span>
                <strong>{folder.name}</strong>
                <small>{(folder.pieceIds || []).length + (folder.templateIds || []).length} saved</small>
              </span>
            </button>
          ))}
        </div>

        {selectedFolder ? (
          <section className="folder-board-area">
            <div className="board-heading">
              <div>
                <button className="back-link" onClick={() => setSelectedFolderId(null)}>Back to folders</button>
                <h2>{selectedFolder.name}</h2>
                {selectedFolder.description && <p>{selectedFolder.description}</p>}
              </div>
              <div className="board-actions"><label className="btn-secondary upload-inspiration">+ Inspiration<input type="file" accept="image/*" onChange={addInspiration} /></label><button className="btn-primary" onClick={() => onOpenBoardWheel(selectedFolder.id)}>Spin this board</button><button className="text-danger" onClick={deleteFolder}>Delete folder</button></div>
            </div>

            <div className="board-toolbar"><input placeholder="Search this board" value={boardSearch} onChange={event => setBoardSearch(event.target.value)} /><div className="board-view-buttons">{['All', 'Favorites', 'Recent'].map(view => <button key={view} className={boardView === view ? 'active' : ''} onClick={() => setBoardView(view)}>{view}</button>)}</div></div>
            <div className="board-filters"><select value={boardFilters.season} onChange={event => setBoardFilters(prev => ({ ...prev, season: event.target.value }))}><option>All seasons</option><option>Spring</option><option>Summer</option><option>Autumn</option><option>Winter</option><option>All year</option></select><select value={boardFilters.occasion} onChange={event => setBoardFilters(prev => ({ ...prev, occasion: event.target.value }))}><option>All occasions</option><option>Everyday</option><option>Work</option><option>Formal</option><option>Going out</option><option>Travel</option></select><select value={boardFilters.color} onChange={event => setBoardFilters(prev => ({ ...prev, color: event.target.value }))}><option>All colors</option>{[...new Set(boardItems.map(({ item }) => item.color).filter(Boolean))].map(color => <option key={color}>{color}</option>)}</select><select value={boardFilters.category} onChange={event => setBoardFilters(prev => ({ ...prev, category: event.target.value }))}><option>All types</option>{[...new Set(boardItems.map(({ item }) => item.category || item.type).filter(Boolean))].map(category => <option key={category}>{category}</option>)}</select></div>

            <div className="board-grid">
              {visibleBoardItems.map(({ key, type, item }) => (
                <article className="board-card" key={key} draggable onDragStart={() => setDraggedKey(key)} onDragOver={event => event.preventDefault()} onDrop={() => { reorderBoard(draggedKey, key); setDraggedKey(null) }}>
                  {item.photoUrl ? <img src={item.photoUrl} alt={item.name} /> : <div className="board-placeholder">No photo</div>}
                  <div className="board-card-copy"><div className="piece-title-row"><strong>{item.name}</strong><button className={`favorite-button ${item.favorite ? 'active' : ''}`} onClick={() => { if (type === 'inspiration') { updateFolders(folders.map(folder => folder.id === selectedFolderId ? { ...folder, inspirations: (folder.inspirations || []).map(inspiration => inspiration.id === item.id ? { ...inspiration, favorite: !inspiration.favorite } : inspiration) } : folder)) } }}>{item.favorite ? '♥' : '♡'}</button></div><span>{type === 'inspiration' ? 'Inspiration' : item.category || item.type}</span>{item.notes && <small className="board-note">{item.notes}</small>}</div>
                  <button className="remove-board-item" onClick={() => removeFromFolder(type, item.id)}>Remove</button>
                </article>
              ))}
            </div>

            <div className="board-add-section">
              <h3>Add to this board</h3>
              <div className="addable-grid">
                {wardrobePieces.filter(piece => !(selectedFolder.pieceIds || []).includes(piece.id)).map(piece => (
                  <button key={`add-piece-${piece.id}`} className="addable-item" onClick={() => addToFolder('piece', piece.id)}>
                    <span>+ Add piece</span><strong>{piece.name}</strong>
                  </button>
                ))}
                {templates.filter(template => !(selectedFolder.templateIds || []).includes(template.id)).map(template => (
                  <button key={`add-template-${template.id}`} className="addable-item" onClick={() => addToFolder('template', template.id)}>
                    <span>+ Add template</span><strong>{template.name}</strong>
                  </button>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <div className="folders-empty">
            <p>Select a folder to open its board.</p>
            <span>Your saved pieces and looks will appear in a visual layout here.</span>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={event => event.stopPropagation()}>
            <div className="modal-header"><h2>New folder</h2><button className="modal-close" onClick={() => setShowCreateModal(false)}>×</button></div>
            <div className="modal-body">
              <div className="form-section"><label>Name</label><input autoFocus placeholder="e.g. Weekend moodboard" value={folderName} onChange={event => setFolderName(event.target.value)} /></div>
              <div className="form-section"><label>Description</label><textarea placeholder="What belongs in this board?" rows="3" value={folderDescription} onChange={event => setFolderDescription(event.target.value)} /></div>
            </div>
            <div className="modal-footer"><button className="btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button><button className="btn-primary" onClick={createFolder}>Create folder</button></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Folders
