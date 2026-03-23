const DataTable = ({ columns, rows, actions, emptyText = 'No records available.' }) => {
  if (!rows?.length) {
    return <div className="table-empty">{emptyText}</div>;
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
            {actions?.length ? <th>Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={row._id || row.id || rowIndex}>
              {columns.map((column) => (
                <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>
              ))}
              {actions?.length ? (
                <td>
                  <div className="table-actions">
                    {actions.map((action) => (
                      <button
                        key={action.label}
                        type="button"
                        className={`ghost-button ${action.variant || ''}`.trim()}
                        onClick={() => action.onClick(row)}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
