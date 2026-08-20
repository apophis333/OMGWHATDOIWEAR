import PageHeader from '../components/PageHeader'
import './Statistics.css'

function Statistics({ wearHistory, templates }) {
  const wearsByTemplate = {}
  wearHistory.forEach(wear => {
    if (!wearsByTemplate[wear.templateId]) {
      wearsByTemplate[wear.templateId] = 0
    }
    wearsByTemplate[wear.templateId]++
  })

  const topWears = Object.entries(wearsByTemplate)
    .map(([templateId, count]) => {
      const template = templates.find(t => t.id === parseInt(templateId))
      return { template: template?.name || 'Unknown', count }
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  return (
    <div className="page">
      <PageHeader 
        title="Wear Statistics"
      />

      <div className="statistics-content">
        {wearHistory.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon" aria-hidden="true">S</div>
            <p>No wears logged yet. Start logging outfits from templates or the wheel to see your stats here.</p>
          </div>
        ) : (
          <div className="stats-dashboard">
            <div className="stat-box">
              <div className="stat-title">Total Wears</div>
              <div className="stat-big-value">{wearHistory.length}</div>
            </div>

            <div className="stat-box">
              <div className="stat-title">Total Templates Used</div>
              <div className="stat-big-value">{Object.keys(wearsByTemplate).length}</div>
            </div>

            <div className="stat-box full-width">
              <div className="stat-title">Top Worn Templates</div>
              <div className="top-wears-list">
                {topWears.length === 0 ? (
                  <p className="no-data">No templates worn yet</p>
                ) : (
                  topWears.map((item, index) => (
                    <div key={index} className="wear-item">
                      <span className="rank">#{index + 1}</span>
                      <span className="template-name">{item.template}</span>
                      <span className="wear-count">{item.count} wear{item.count !== 1 ? 's' : ''}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="stat-box full-width">
              <div className="stat-title">Wear History</div>
              <div className="wear-history-list">
                {wearHistory.slice().reverse().map(wear => (
                  <div key={wear.id} className="history-item">
                    <div className="history-date">
                      {new Date(wear.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="history-template">{wear.templateName}</div>
                    {wear.notes && <div className="history-notes">{wear.notes}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Statistics
