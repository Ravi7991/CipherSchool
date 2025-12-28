import React, { useState } from 'react';
import './SampleDataViewer.scss';

const SampleDataViewer = ({ sampleData }) => {
  const [activeTable, setActiveTable] = useState(null);

  const tableNames = Object.keys(sampleData);

  // Set first table as active by default
  React.useEffect(() => {
    if (tableNames.length > 0 && !activeTable) {
      setActiveTable(tableNames[0]);
    }
  }, [tableNames, activeTable]);

  if (tableNames.length === 0) {
    return (
      <div className="sample-data-viewer">
        <h3>Sample Data</h3>
        <p className="sample-data-viewer__empty">No sample data available</p>
      </div>
    );
  }

  const currentTable = sampleData[activeTable];

  return (
    <div className="sample-data-viewer">
      <div className="sample-data-viewer__header">
        <h3>Sample Data</h3>
        <p className="sample-data-viewer__description">
          Explore the table structures and sample data for this assignment
        </p>
      </div>

      {/* Table Tabs */}
      <div className="table-tabs">
        {tableNames.map((tableName) => (
          <button
            key={tableName}
            className={`table-tabs__tab ${activeTable === tableName ? 'table-tabs__tab--active' : ''}`}
            onClick={() => setActiveTable(tableName)}
          >
            {tableName}
          </button>
        ))}
      </div>

      {/* Active Table Content */}
      {currentTable && (
        <div className="table-content">
          {currentTable.description && (
            <p className="table-content__description">
              {currentTable.description}
            </p>
          )}

          {currentTable.error ? (
            <div className="table-content__error">
              <p>⚠️ {currentTable.error}</p>
            </div>
          ) : (
            <div className="table-content__data">
              {currentTable.rows && currentTable.rows.length > 0 ? (
                <div className="data-table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        {currentTable.columns.map((column, index) => (
                          <th key={index} className="data-table__header">
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {currentTable.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="data-table__row">
                          {currentTable.columns.map((column, colIndex) => (
                            <td key={colIndex} className="data-table__cell">
                              {row[column] !== null && row[column] !== undefined 
                                ? String(row[column]) 
                                : <span className="data-table__null">NULL</span>
                              }
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="table-content__empty">No data available</p>
              )}

              {currentTable.rows && currentTable.rows.length >= 10 && (
                <p className="table-content__note">
                  Showing first 10 rows. The table may contain more data.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SampleDataViewer;