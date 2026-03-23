const FilterBar = ({ filters, onChange, buildings = [], showBuilding = false }) => {
  const handleInputChange = (event) => {
    onChange({ ...filters, [event.target.name]: event.target.value });
  };

  return (
    <div className="filter-bar panel">
      <div className="filter-field">
        <label htmlFor="granularity">Granularity</label>
        <select id="granularity" name="granularity" value={filters.granularity} onChange={handleInputChange}>
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <div className="filter-field">
        <label htmlFor="year">Year</label>
        <input id="year" name="year" value={filters.year || ''} onChange={handleInputChange} placeholder="2026" />
      </div>
      <div className="filter-field">
        <label htmlFor="month">Month</label>
        <select id="month" name="month" value={filters.month || ''} onChange={handleInputChange}>
          <option value="">All</option>
          {Array.from({ length: 12 }, (_, index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>
      </div>
      {showBuilding ? (
        <div className="filter-field">
          <label htmlFor="buildingId">Building</label>
          <select id="buildingId" name="buildingId" value={filters.buildingId || ''} onChange={handleInputChange}>
            <option value="">All Buildings</option>
            {buildings.map((building) => (
              <option key={building._id} value={building._id}>
                {building.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}
    </div>
  );
};

export default FilterBar;
