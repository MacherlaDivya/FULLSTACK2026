import React from 'react';
import Welcome from './components/Welcome';
import CourseList from './components/CourseList';
import './App.css';

// Main App Component - This is where all components are rendered
function App() {
  // Sample course data - in a real app, this might come from an API
  const courses = [
    {
      id: 1,
      title: 'Introduction to React',
      description: 'Learn the fundamentals of React including components, props, and state',
      duration: '4 weeks',
      instructor: 'John Doe',
      price: '$99'
    },
    {
      id: 2,
      title: 'Advanced JavaScript',
      description: 'Deep dive into ES6+, async programming, and design patterns',
      duration: '6 weeks',
      instructor: 'Jane Smith',
      price: '$129'
    },
    {
      id: 3,
      title: 'Node.js Backend Development',
      description: 'Build scalable backend applications with Node.js and Express',
      duration: '8 weeks',
      instructor: 'Mike Johnson',
      price: '$149'
    },
    {
      id: 4,
      title: 'Full Stack Web Development',
      description: 'Master both frontend and backend development with modern tools',
      duration: '12 weeks',
      instructor: 'Sarah Williams',
      price: '$249'
    }
  ];

  return (
    <div className="App">
      {/* Welcome Component - displays greeting and intro message */}
      <Welcome />
      
      {/* CourseList Component - displays all available courses */}
      <CourseList courses={courses} />
    </div>
  );
}

export default App;
