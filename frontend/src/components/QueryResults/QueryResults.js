import React from 'react';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import './QueryResults.scss';

const QueryResults = ({ results, error, loading, onClear }) => {
  if (loading) {
    return (
      <div className="query-results">
        <div className="query-results__header">
          <h3>Query Results</h3>
        </div>
        <LoadingSpinner size="small" message="Executing query..." />
      </div>
    );
  }

  if (!results && !error) {
    return (
      <div className="query-results">
        <div className="query-results__header">
          <h3>Query Results</h3>
        </div>
        <div className="query-results__placeholder">
          <p>Execute a query to see results here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="query-results">
      <div className="query-results__header">
        <h3>Query Results</h3>
        {(results || error) && (
          <button onClick={onClear} className="btn btn--secondary btn--small">
            Clear
          </button>
        )}
      </div>

      {error && (
        <div className="query-results__error">
          <div className="error-message">
            <h4>❌ Query Error</h4>
            <p>{error}</p>
          </div>
        </div>
      )}

      {results && (
        <div className="query-results__success">
          <div className="results-info">
            <div className="results-info__stats">
              <span className="results-info__count">
                {results.rowCount} row{results.rowCount !== 1 ? 's' : ''} returned
              </span>
              <span className="results-info__time">
                Executed in {results.executionTime}ms
              </span>
              {results.usingMockData && (
                <span className="results-info__demo">
                  🎭 Demo Mode (Mock Data)
                </span>
              )}
            </div>
          </div>

          {results.rows && results.rows.length > 0 ? (
            <div className="results-table-wrapper">
              <table className="results-table">
                <thead>
                  <tr>
                    {results.columns.map((column, index) => (
                      <th key={index} className="results-table__header">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="results-table__row">
                      {results.columns.map((column, colIndex) => (
                        <td key={colIndex} className="results-table__cell">
                          {row[column] !== null && row[column] !== undefined 
                            ? String(row[column]) 
                            : <span className="results-table__null">NULL</span>
                          }
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="query-results__empty">
              <p>✅ Query executed successfully but returned no rows</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QueryResults;