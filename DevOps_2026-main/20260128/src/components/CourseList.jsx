import React from 'react';
import CourseCard from './CourseCard';

// Functional Component - CourseList
// Demonstrates reusability by rendering multiple CourseCard components
function CourseList({ courses }) {
  return (
    <div className="course-list-section">
      <h2>Available Courses</h2>
      <p className="section-subtitle">
        Choose from our selection of professional courses
      </p>
      
      <div className="course-grid">
        {/* Mapping through courses array and rendering a CourseCard for each */}
        {/* This demonstrates component reusability - same component, different data */}
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}

export default CourseList;
