import { useState } from 'react'
import './Folders.css'

function Folders({ folders, updateFolders, wardrobePieces, templates }) {
  const [selectedFolderId, setSelectedFolderId] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [folderName, setFolderName] = useState('')
  const [folderDescription, setFolderDescription] = useState('')

  const selectedFolder = folders.find(folder => folder.id === selectedFolderId)
  const folderPieces = selectedFolder
    ? wardrobePieces.filter(piece => (selectedFolder.pieceIds || []).includes(piece.id))
    : []
  const folderTemplates = selectedFolder
    ? templates.filter(template => (selectedFolder.templateIds || []).includes(template.id))
    : []

  const createFolder = () => {
    if (!folderName.trim()) return
    const folder = {
      id: Date.now(),
      name: folderName.trim(),
      description: folderDescription.trim(),
      pieceIds: [],
      templateIds: []
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
      return ids.includes(id) ? folder : { ...folder, [key]: [...ids, id] }
    }))
  }

  const removeFromFolder = (type, id) => {
    updateFolders(folders.map(folder => {
      if (folder.id !== selectedFolderId) return folder
      const key = type === 'piece' ? 'pieceIds' : 'templateIds'
      return { ...folder, [key]: (folder[key] || []).filter(itemId => itemId !== id) }
    }))
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
              <button className="text-danger" onClick={deleteFolder}>Delete folder</button>
            </div>

            <div className="board-grid">
              {folderPieces.map(piece => (
                <article className="board-card" key={`piece-${piece.id}`}>
                  {piece.photoUrl ? <img src={piece.photoUrl} alt={piece.name} /> : <div className="board-placeholder">No photo</div>}
                  <div className="board-card-copy"><strong>{piece.name}</strong><span>{piece.category}</span></div>
                  <button className="remove-board-item" onClick={() => removeFromFolder('piece', piece.id)}>Remove</button>
                </article>
              ))}
              {folderTemplates.map(template => (
                <article className="board-card" key={`template-${template.id}`}>
                  {template.photoUrl ? <img src={template.photoUrl} alt={template.name} /> : <div className="board-placeholder">No photo</div>}
                  <div className="board-card-copy"><strong>{template.name}</strong><span>{template.type}</span></div>
                  <button className="remove-board-item" onClick={() => removeFromFolder('template', template.id)}>Remove</button>
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
