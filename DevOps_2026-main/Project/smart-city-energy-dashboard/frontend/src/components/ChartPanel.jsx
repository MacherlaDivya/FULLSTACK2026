const ChartPanel = ({ title, subtitle, actions, children, className = '' }) => (
  <section className={`panel chart-panel ${className}`.trim()}>
    <div className="panel-head">
      <div>
        <h3>{title}</h3>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {actions ? <div className="panel-actions">{actions}</div> : null}
    </div>
    <div className="panel-body">{children}</div>
  </section>
);

export default ChartPanel;
