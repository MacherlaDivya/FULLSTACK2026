import { formatNumber } from '../utils/formatters';

const AlertBanner = ({ alerts = [] }) => {
  if (!alerts.length) {
    return (
      <section className="panel alert-banner calm">
        <div>
          <h3>System Alerts</h3>
          <p>No abnormal city-wide energy spikes detected in the last 30 days.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="panel alert-banner">
      <div className="panel-head">
        <div>
          <h3>High Usage Alerts</h3>
          <p>Top monitored buildings with elevated consumption in the current cycle.</p>
        </div>
      </div>
      <div className="alert-list">
        {alerts.map((alert) => (
          <article key={alert.buildingName} className={`alert-item ${alert.level}`}>
            <strong>{alert.buildingName}</strong>
            <span>{alert.buildingType}</span>
            <span>{formatNumber(alert.totalKwh)} kWh</span>
          </article>
        ))}
      </div>
    </section>
  );
};

export default AlertBanner;
