import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assignmentAPI } from '../../services/api';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import WelcomeMessage from '../WelcomeMessage/WelcomeMessage';
import './AssignmentList.scss';

const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await assignmentAPI.getAll();
      setAssignments(response.data);
    } catch (err) {
      setError('Failed to load assignments. Please try again later.');
      console.error('Error fetching assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyClass = (difficulty) => {
    return `assignment-card__difficulty--${difficulty.toLowerCase()}`;
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="assignment-list__error">
        <p>{error}</p>
        <button onClick={fetchAssignments} className="btn btn--primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="assignment-list">
      <div className="assignment-list__container">
        <WelcomeMessage />
        
        <div className="assignment-list__header">
          <h2 className="assignment-list__title">SQL Practice Assignments</h2>
          <p className="assignment-list__subtitle">
            Choose an assignment to start practicing your SQL skills
          </p>
        </div>

        <div className="assignment-list__grid">
          {assignments.map((assignment) => (
            <Link
              key={assignment._id}
              to={`/assignment/${assignment._id}`}
              className="assignment-card"
            >
              <div className="assignment-card__header">
                <h3 className="assignment-card__title">{assignment.title}</h3>
                <span className={`assignment-card__difficulty ${getDifficultyClass(assignment.difficulty)}`}>
                  {assignment.difficulty}
                </span>
              </div>
              
              <p className="assignment-card__description">
                {assignment.description}
              </p>
              
              <div className="assignment-card__footer">
                <span className="assignment-card__tables">
                  Tables: {assignment.expectedTables.map(t => t.name).join(', ')}
                </span>
                <span className="assignment-card__arrow">→</span>
              </div>
            </Link>
          ))}
        </div>

        {assignments.length === 0 && (
          <div className="assignment-list__empty">
            <p>No assignments available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentList;