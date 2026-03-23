const Loader = ({ label = 'Loading smart city insights...' }) => (
  <div className="loader-shell">
    <div className="loader-ring" />
    <p>{label}</p>
  </div>
);

export default Loader;
