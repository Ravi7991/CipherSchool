import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { assignmentAPI, queryAPI, hintAPI } from '../../services/api';
import { useSession } from '../../utils/sessionContext';
import SQLEditor from '../SQLEditor/SQLEditor';
import SampleDataViewer from '../SampleDataViewer/SampleDataViewer';
import QueryResults from '../QueryResults/QueryResults';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import './AssignmentAttempt.scss';

const AssignmentAttempt = () => {
  const { id } = useParams();
  const { sessionId } = useSession();
  
  const [assignment, setAssignment] = useState(null);
  const [sampleData, setSampleData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [query, setQuery] = useState('');
  const [queryResults, setQueryResults] = useState(null);
  const [queryLoading, setQueryLoading] = useState(false);
  const [queryError, setQueryError] = useState(null);
  
  const [hint, setHint] = useState('');
  const [hintLoading, setHintLoading] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);

  const fetchAssignment = useCallback(async () => {
    try {
      setLoading(true);
      const response = await assignmentAPI.getById(id);
      setAssignment(response.data.assignment);
      setSampleData(response.data.sampleData);
    } catch (err) {
      setError('Failed to load assignment. Please try again later.');
      console.error('Error fetching assignment:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchAssignment();
    }
  }, [id, fetchAssignment]);

  const executeQuery = async () => {
    if (!query.trim()) {
      setQueryError('Please enter a SQL query');
      return;
    }

    try {
      setQueryLoading(true);
      setQueryError(null);
      setQueryResults(null);

      const response = await queryAPI.execute({
        query: query.trim(),
        assignmentId: id,
        sessionId
      });

      if (response.data.success) {
        setQueryResults(response.data);
      } else {
        setQueryError(response.data.error);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to execute query';
      setQueryError(errorMessage);
      console.error('Query execution error:', err);
    } finally {
      setQueryLoading(false);
    }
  };

  const getHint = async () => {
    try {
      setHintLoading(true);
      
      const response = await hintAPI.generate({
        assignmentId: id,
        sessionId,
        userQuery: query,
        errorMessage: queryError
      });

      setHint(response.data.hint);
      setHintsUsed(response.data.hintsUsed);
    } catch (err) {
      console.error('Hint generation error:', err);
      setHint('Unable to generate hint at the moment. Please try again later.');
    } finally {
      setHintLoading(false);
    }
  };

  const clearResults = () => {
    setQueryResults(null);
    setQueryError(null);
    setHint('');
  };

  if (loading) return <LoadingSpinner message="Loading assignment..." />;

  if (error) {
    return (
      <div className="assignment-attempt__error">
        <p>{error}</p>
        <button onClick={fetchAssignment} className="btn btn--primary">
          Try Again
        </button>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="assignment-attempt__error">
        <p>Assignment not found</p>
      </div>
    );
  }

  return (
    <div className="assignment-attempt">
      <div className="assignment-attempt__container">
        {/* Assignment Question Panel */}
        <div className="assignment-attempt__question">
          <div className="question-panel">
            <div className="question-panel__header">
              <h2 className="question-panel__title">{assignment.title}</h2>
              <span className={`difficulty-badge difficulty-badge--${assignment.difficulty.toLowerCase()}`}>
                {assignment.difficulty}
              </span>
            </div>
            
            <div className="question-panel__content">
              <p className="question-panel__description">{assignment.description}</p>
              <div className="question-panel__question">
                <h3>Question:</h3>
                <p>{assignment.question}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="assignment-attempt__main">
          {/* Sample Data Viewer */}
          <div className="assignment-attempt__data">
            <SampleDataViewer sampleData={sampleData} />
          </div>

          {/* SQL Editor and Controls */}
          <div className="assignment-attempt__editor">
            <div className="editor-panel">
              <div className="editor-panel__header">
                <h3>SQL Query Editor</h3>
                <div className="editor-panel__actions">
                  <button
                    onClick={getHint}
                    disabled={hintLoading}
                    className="btn btn--secondary btn--small"
                  >
                    {hintLoading ? 'Getting Hint...' : `Get Hint ${hintsUsed > 0 ? `(${hintsUsed})` : ''}`}
                  </button>
                  <button
                    onClick={executeQuery}
                    disabled={queryLoading || !query.trim()}
                    className="btn btn--primary"
                  >
                    {queryLoading ? 'Executing...' : 'Execute Query'}
                  </button>
                </div>
              </div>

              <SQLEditor
                value={query}
                onChange={setQuery}
                onExecute={executeQuery}
              />

              {hint && (
                <div className="hint-panel">
                  <div className="hint-panel__header">
                    <h4>💡 Hint</h4>
                  </div>
                  <p className="hint-panel__content">{hint}</p>
                </div>
              )}
            </div>
          </div>

          {/* Query Results */}
          <div className="assignment-attempt__results">
            <QueryResults
              results={queryResults}
              error={queryError}
              loading={queryLoading}
              onClear={clearResults}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentAttempt;