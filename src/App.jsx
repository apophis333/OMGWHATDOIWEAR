import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Wardrobe from './pages/Wardrobe'
import Templates from './pages/Templates'
import Folders from './pages/Folders'
import Wheel from './pages/Wheel'
import Statistics from './pages/Statistics'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [data, setData] = useState({
    wardrobePieces: [],
    templates: [],
    folders: [],
    wearHistory: [],
  })

  // Load data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('whatsMyStyleData')
    if (saved) {
      try {
        setData(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load data:', e)
      }
    }
  }, [])

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('whatsMyStyleData', JSON.stringify(data))
  }, [data])

  const updateWardrobePieces = (pieces) => {
    setData(prev => ({ ...prev, wardrobePieces: pieces }))
  }

  const updateTemplates = (templates) => {
    setData(prev => ({ ...prev, templates }))
  }

  const updateWearHistory = (history) => {
    setData(prev => ({ ...prev, wearHistory: history }))
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home data={data} onNavigate={setCurrentPage} />
      case 'wardrobe':
        return <Wardrobe pieces={data.wardrobePieces} updatePieces={updateWardrobePieces} />
      case 'templates':
        return <Templates 
          templates={data.templates} 
          updateTemplates={updateTemplates}
          wardrobePieces={data.wardrobePieces}
        />
      case 'folders':
        return <Folders
          folders={data.folders || []}
          updateFolders={(folders) => setData(prev => ({ ...prev, folders }))}
          wardrobePieces={data.wardrobePieces}
          templates={data.templates}
        />
      case 'wheel':
        return <Wheel 
          templates={data.templates}
          wearHistory={data.wearHistory}
          updateWearHistory={updateWearHistory}
          onCreateTemplate={() => setCurrentPage('templates')}
        />
      case 'statistics':
        return <Statistics wearHistory={data.wearHistory} templates={data.templates} />
      default:
        return <Home data={data} onNavigate={setCurrentPage} />
    }
  }

  return (
    <div className="app-container">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  )
}

export default App
