import React from 'react';

// Reusable Functional Component - CourseCard
// This component can be reused for displaying any course
// Props allow us to pass different data to each instance
function CourseCard({ course }) {
  // Destructuring props for cleaner code
  const { title, description, duration, instructor, price } = course;

  return (
    <div className="course-card">
      <div className="course-header">
        <h3>{title}</h3>
        <span className="price">{price}</span>
      </div>
      <p className="course-description">{description}</p>
      <div className="course-details">
        <div className="detail-item">
          <span className="label">Duration:</span>
          <span className="value">{duration}</span>
        </div>
        <div className="detail-item">
          <span className="label">Instructor:</span>
          <span className="value">{instructor}</span>
        </div>
      </div>
      <button className="enroll-btn">Enroll Now</button>
    </div>
  );
}

export default CourseCard;
