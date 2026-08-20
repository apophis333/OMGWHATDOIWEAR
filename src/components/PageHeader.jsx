import './PageHeader.css'

function PageHeader({ title, subtitle, actionButton }) {
  return (
    <div className="page-header">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {actionButton && <div className="page-action">{actionButton}</div>}
    </div>
  )
}

export default PageHeader
