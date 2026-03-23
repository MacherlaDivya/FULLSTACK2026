import { formatCompact, formatNumber } from '../utils/formatters';

const StatCard = ({ title, value, suffix = '', compact = false, accent = 'teal', subtitle }) => (
  <article className={`stat-card accent-${accent}`}>
    <span className="stat-label">{title}</span>
    <strong className="stat-value">{compact ? formatCompact(value) : formatNumber(value)}{suffix}</strong>
    {subtitle ? <span className="stat-subtitle">{subtitle}</span> : null}
  </article>
);

export default StatCard;
