import { useState } from "react";

function Courses() {
  const [courses, setCourses] = useState([
    { 
      id: 1, 
      name: "Data Structures", 
      icon: "📊", 
      credits: 4, 
      progress: 85, 
      color: "#667eea",
      grade: "A-",
      instructor: "Dr. Smith",
      assignments: 18,
      totalAssignments: 20,
    },
    { 
      id: 2, 
      name: "Web Technologies", 
      icon: "🌐", 
      credits: 3, 
      progress: 90, 
      color: "#10b981",
      grade: "A",
      instructor: "Prof. Johnson",
      assignments: 15,
      totalAssignments: 15,
    },
    { 
      id: 3, 
      name: "Database Management Systems", 
      icon: "💾", 
      credits: 4, 
      progress: 75, 
      color: "#f59e0b",
      grade: "B+",
      instructor: "Dr. Williams",
      assignments: 12,
      totalAssignments: 16,
    },
    { 
      id: 4, 
      name: "Software Engineering", 
      icon: "🛠️", 
      credits: 3, 
      progress: 88, 
      color: "#ec4899",
      grade: "A-",
      instructor: "Prof. Brown",
      assignments: 14,
      totalAssignments: 16,
    },
  ]);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGrade, setFilterGrade] = useState("All");
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === "All" || course.grade.startsWith(filterGrade.charAt(0));
    return matchesSearch && matchesGrade;
  });

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    showNotification(`📚 Viewing details for ${course.name}`, "info");
  };

  const handleDownload = () => {
    showNotification("✓ Materials downloaded successfully!", "success");
  };

  return (
    <div style={styles.container}>
      {/* Notification Toast */}
      {notification && (
        <div style={{
          ...styles.notification,
          ...styles[`notification_${notification.type}`],
          animation: "slideInDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)"
        }}>
          <span style={styles.notificationText}>{notification.message}</span>
          <button 
            onClick={() => setNotification(null)}
            style={styles.notificationClose}
          >
            ✕
          </button>
        </div>
      )}

      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>📚 Enrolled Courses</h1>
          <p style={styles.subtitle}>Manage your coursework, track progress, and view grades</p>
        </div>
        <button style={styles.addBtn} onClick={() => showNotification("✓ New course added!", "success")}>+ Add Course</button>
      </div>

      {/* Search and Filter */}
      <div style={styles.filterSection}>
        <input
          type="text"
          placeholder="🔍 Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <select value={filterGrade} onChange={(e) => setFilterGrade(e.target.value)} style={styles.filterSelect}>
          <option>All Grades</option>
          <option>A</option>
          <option>B</option>
          <option>C</option>
        </select>
      </div>

      {/* Courses Grid */}
      <div style={styles.coursesGrid}>
        {filteredCourses.map((course, index) => (
          <div 
            key={course.id} 
            style={{
              ...styles.courseCard,
              animation: `slideIn 0.5s ease-out ${index * 0.1}s both`,
              borderLeft: `5px solid ${course.color}`,
              transform: hoveredCourse === course.id ? "translateY(-8px)" : "translateY(0)",
              boxShadow: hoveredCourse === course.id ? `0 20px 50px ${course.color}33` : "0 10px 40px rgba(0, 0, 0, 0.08)",
            }}
            onMouseEnter={() => setHoveredCourse(course.id)}
            onMouseLeave={() => setHoveredCourse(null)}
            onClick={() => handleCourseClick(course)}
          >
            <div style={styles.courseHeader}>
              <div style={{...styles.courseIconBox, backgroundColor: course.color + "20"}}>
                <span style={styles.courseIcon}>{course.icon}</span>
              </div>
              <div style={styles.courseHeaderInfo}>
                <h3 style={styles.courseName}>{course.name}</h3>
                <p style={styles.instructor}>👨‍🏫 {course.instructor}</p>
              </div>
              <span style={{...styles.gradeLabel, backgroundColor: course.color + "20", color: course.color}}>
                {course.grade}
              </span>
            </div>

            <div style={styles.courseStats}>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>Progress</span>
                <div style={styles.progressBar}>
                  <div style={{...styles.progressFill, width: `${course.progress}%`, backgroundColor: course.color}}></div>
                </div>
                <span style={styles.statValue}>{course.progress}%</span>
              </div>

              <div style={styles.statRow}>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>Assignments</span>
                  <span style={styles.statValue}>{course.assignments}/{course.totalAssignments}</span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>Credits</span>
                  <span style={styles.statValue}>{course.credits}</span>
                </div>
              </div>
            </div>

            <div style={styles.courseActions}>
              <button style={{...styles.actionBtn, backgroundColor: course.color}}>View Details</button>
              <button style={styles.secondaryBtn}>📝 Assignments</button>
            </div>
          </div>
        ))}
      </div>

      {/* Course Details Modal */}
      {selectedCourse && (
        <div style={styles.modal} onClick={() => setSelectedCourse(null)}>
          <div style={{...styles.modalContent, animation: "slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)"}} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setSelectedCourse(null)}>✕</button>
            
            <div style={styles.modalHeader}>
              <span style={styles.modalIcon}>{selectedCourse.icon}</span>
              <h2 style={styles.modalTitle}>{selectedCourse.name}</h2>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.modalGrid}>
                {[
                  { title: "Current Grade", value: selectedCourse.grade, delay: "0s" },
                  { title: "Progress", value: `${selectedCourse.progress}%`, delay: "0.1s" },
                  { title: "Assignments", value: `${selectedCourse.assignments}/${selectedCourse.totalAssignments}`, delay: "0.2s" },
                  { title: "Credits", value: selectedCourse.credits, delay: "0.3s" },
                ].map((card, idx) => (
                  <div key={idx} style={{...styles.modalCard, animation: `scaleUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${card.delay}`}}>
                    <h4 style={styles.modalCardTitle}>{card.title}</h4>
                    <p style={{...styles.modalCardValue, color: selectedCourse.color}}>{card.value}</p>
                  </div>
                ))}
              </div>

              <div style={styles.modalSection}>
                <h4 style={styles.modalSectionTitle}>Instructor</h4>
                <p style={styles.modalSectionContent}>{selectedCourse.instructor}</p>
              </div>

              <div style={styles.modalSection}>
                <h4 style={styles.modalSectionTitle}>Recent Submissions</h4>
                <ul style={styles.submissionsList}>
                  {[
                    { text: "Assignment 5 - Submitted (95%)", icon: "✅" },
                    { text: "Quiz 3 - Completed (92%)", icon: "✅" },
                    { text: "Project 2 - In Progress", icon: "⏳" },
                  ].map((item, idx) => (
                    <li key={idx} style={{...styles.submissionItem, animation: `slideInLeft 0.3s ease-out ${0.2 + idx * 0.1}s both`}}>
                      <span style={styles.submissionIcon}>{item.icon}</span>
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={styles.modalActions}>
                <button style={{...styles.primaryBtn, backgroundColor: selectedCourse.color}}>View Full Details</button>
                <button style={styles.secondaryBtn} onClick={handleDownload}>Download Materials</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideInDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    position: "relative",
  },
  notification: {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "16px 24px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
    zIndex: 2000,
    maxWidth: "400px",
  },
  notification_success: {
    backgroundColor: "#d1fae5",
    color: "#059669",
    borderLeft: "4px solid #10b981",
  },
  notification_info: {
    backgroundColor: "#dbeafe",
    color: "#0369a1",
    borderLeft: "4px solid #0284c7",
  },
  notificationText: {
    fontWeight: "600",
    fontSize: "14px",
    flex: 1,
  },
  notificationClose: {
    backgroundColor: "transparent",
    border: "none",
    color: "inherit",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "bold",
    transition: "all 0.2s ease",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "40px",
    gap: "20px",
  },
  heading: {
    fontSize: "42px",
    fontWeight: "800",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    marginBottom: "12px",
  },
  subtitle: {
    fontSize: "18px",
    color: "#6b7280",
    fontWeight: "500",
  },
  addBtn: {
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    padding: "12px 28px",
    borderRadius: "10px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
  },
  filterSection: {
    display: "flex",
    gap: "15px",
    marginBottom: "30px",
  },
  searchInput: {
    flex: 1,
    padding: "12px 18px",
    borderRadius: "10px",
    border: "2px solid #e5e7eb",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.3s ease",
    outline: "none",
  },
  filterSelect: {
    padding: "12px 18px",
    borderRadius: "10px",
    border: "2px solid #e5e7eb",
    backgroundColor: "white",
    cursor: "pointer",
    fontWeight: "600",
    outline: "none",
    transition: "all 0.3s ease",
  },
  coursesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "25px",
  },
  courseCard: {
    backgroundColor: "white",
    padding: "28px",
    borderRadius: "16px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
    border: "1px solid #f0f0f0",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
  },
  courseHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: "15px",
    marginBottom: "20px",
  },
  courseIconBox: {
    width: "55px",
    height: "55px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "26px",
    flexShrink: 0,
  },
  courseIcon: {
    fontSize: "26px",
  },
  courseHeaderInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1f2937",
    margin: "0 0 6px 0",
  },
  instructor: {
    fontSize: "13px",
    color: "#6b7280",
    margin: 0,
    fontWeight: "500",
  },
  gradeLabel: {
    padding: "6px 12px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "700",
  },
  courseStats: {
    marginBottom: "20px",
  },
  statItem: {
    marginBottom: "15px",
  },
  statLabel: {
    fontSize: "12px",
    color: "#9ca3af",
    fontWeight: "700",
    textTransform: "uppercase",
    display: "block",
    marginBottom: "6px",
  },
  progressBar: {
    height: "6px",
    borderRadius: "3px",
    backgroundColor: "#e5e7eb",
    overflow: "hidden",
    marginBottom: "6px",
  },
  progressFill: {
    height: "100%",
    transition: "width 0.6s ease-out",
  },
  statValue: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#1f2937",
  },
  statRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
  },
  courseActions: {
    display: "flex",
    gap: "10px",
  },
  actionBtn: {
    flex: 1,
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "13px",
    transition: "all 0.3s ease",
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    color: "#1f2937",
    border: "1px solid #e5e7eb",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "13px",
    transition: "all 0.3s ease",
  },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    animation: "fadeIn 0.3s ease-out",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: "20px",
    width: "90%",
    maxWidth: "600px",
    maxHeight: "85vh",
    overflow: "auto",
    position: "relative",
    boxShadow: "0 25px 80px rgba(0, 0, 0, 0.2)",
  },
  closeBtn: {
    position: "absolute",
    top: "20px",
    right: "20px",
    backgroundColor: "transparent",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#6b7280",
    zIndex: 10,
    transition: "all 0.2s ease",
  },
  modalHeader: {
    padding: "30px",
    borderBottom: "1px solid #f0f0f0",
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  modalIcon: {
    fontSize: "36px",
  },
  modalTitle: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#1f2937",
    margin: 0,
  },
  modalBody: {
    padding: "30px",
  },
  modalGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
    marginBottom: "25px",
  },
  modalCard: {
    backgroundColor: "#f9fafb",
    padding: "15px",
    borderRadius: "12px",
    textAlign: "center",
  },
  modalCardTitle: {
    fontSize: "12px",
    color: "#9ca3af",
    fontWeight: "700",
    textTransform: "uppercase",
    margin: "0 0 8px 0",
  },
  modalCardValue: {
    fontSize: "28px",
    fontWeight: "800",
    margin: 0,
  },
  modalSection: {
    marginBottom: "25px",
  },
  modalSectionTitle: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: "10px",
  },
  modalSectionContent: {
    color: "#6b7280",
    margin: 0,
    fontSize: "14px",
  },
  submissionsList: {
    list: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  submissionItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    fontSize: "13px",
    color: "#6b7280",
  },
  submissionIcon: {
    fontSize: "14px",
  },
  modalActions: {
    display: "flex",
    gap: "12px",
    paddingTop: "20px",
    borderTop: "1px solid #f0f0f0",
  },
  primaryBtn: {
    flex: 1,
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    transition: "all 0.3s ease",
  },
};

export default Courses;
    { 
      id: 1, 
      name: "Data Structures", 
      icon: "📊", 
      credits: 4, 
      progress: 85, 
      color: "#667eea",
      grade: "A-",
      instructor: "Dr. Smith",
      assignments: 18,
      totalAssignments: 20,
    },
    { 
      id: 2, 
      name: "Web Technologies", 
      icon: "🌐", 
      credits: 3, 
      progress: 90, 
      color: "#10b981",
      grade: "A",
      instructor: "Prof. Johnson",
      assignments: 15,
      totalAssignments: 15,
    },
    { 
      id: 3, 
      name: "Database Management Systems", 
      icon: "💾", 
      credits: 4, 
      progress: 75, 
      color: "#f59e0b",
      grade: "B+",
      instructor: "Dr. Williams",
      assignments: 12,
      totalAssignments: 16,
    },
    { 
      id: 4, 
      name: "Software Engineering", 
      icon: "🛠️", 
      credits: 3, 
      progress: 88, 
      color: "#ec4899",
      grade: "A-",
      instructor: "Prof. Brown",
      assignments: 14,
      totalAssignments: 16,
    },
  ]);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGrade, setFilterGrade] = useState("All");

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === "All" || course.grade.startsWith(filterGrade.charAt(0));
    return matchesSearch && matchesGrade;
  });

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>📚 Enrolled Courses</h1>
          <p style={styles.subtitle}>Manage your coursework, track progress, and view grades</p>
        </div>
        <button style={styles.addBtn}>+ Add Course</button>
      </div>

      {/* Search and Filter */}
      <div style={styles.filterSection}>
        <input
          type="text"
          placeholder="🔍 Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <select value={filterGrade} onChange={(e) => setFilterGrade(e.target.value)} style={styles.filterSelect}>
          <option>All Grades</option>
          <option>A</option>
          <option>B</option>
          <option>C</option>
        </select>
      </div>

      {/* Courses Grid */}
      <div style={styles.coursesGrid}>
        {filteredCourses.map((course, index) => (
          <div 
            key={course.id} 
            style={{
              ...styles.courseCard,
              animation: `slideIn 0.5s ease-out ${index * 0.1}s both`,
              borderLeft: `5px solid ${course.color}`,
            }}
            onClick={() => setSelectedCourse(course)}
          >
            <div style={styles.courseHeader}>
              <div style={{...styles.courseIconBox, backgroundColor: course.color + "20"}}>
                <span style={styles.courseIcon}>{course.icon}</span>
              </div>
              <div style={styles.courseHeaderInfo}>
                <h3 style={styles.courseName}>{course.name}</h3>
                <p style={styles.instructor}>👨‍🏫 {course.instructor}</p>
              </div>
              <span style={{...styles.gradeLabel, backgroundColor: course.color + "20", color: course.color}}>
                {course.grade}
              </span>
            </div>

            <div style={styles.courseStats}>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>Progress</span>
                <div style={styles.progressBar}>
                  <div style={{...styles.progressFill, width: `${course.progress}%`, backgroundColor: course.color}}></div>
                </div>
                <span style={styles.statValue}>{course.progress}%</span>
              </div>

              <div style={styles.statRow}>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>Assignments</span>
                  <span style={styles.statValue}>{course.assignments}/{course.totalAssignments}</span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>Credits</span>
                  <span style={styles.statValue}>{course.credits}</span>
                </div>
              </div>
            </div>

            <div style={styles.courseActions}>
              <button style={{...styles.actionBtn, backgroundColor: course.color}}>View Details</button>
              <button style={styles.secondaryBtn}>📝 Assignments</button>
            </div>
          </div>
        ))}
      </div>

      {/* Course Details Modal */}
      {selectedCourse && (
        <div style={styles.modal} onClick={() => setSelectedCourse(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setSelectedCourse(null)}>✕</button>
            
            <div style={styles.modalHeader}>
              <span style={styles.modalIcon}>{selectedCourse.icon}</span>
              <h2 style={styles.modalTitle}>{selectedCourse.name}</h2>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.modalGrid}>
                <div style={styles.modalCard}>
                  <h4 style={styles.modalCardTitle}>Current Grade</h4>
                  <p style={{...styles.modalCardValue, color: selectedCourse.color}}>{selectedCourse.grade}</p>
                </div>
                <div style={styles.modalCard}>
                  <h4 style={styles.modalCardTitle}>Progress</h4>
                  <p style={{...styles.modalCardValue, color: selectedCourse.color}}>{selectedCourse.progress}%</p>
                </div>
                <div style={styles.modalCard}>
                  <h4 style={styles.modalCardTitle}>Assignments</h4>
                  <p style={{...styles.modalCardValue, color: selectedCourse.color}}>
                    {selectedCourse.assignments}/{selectedCourse.totalAssignments}
                  </p>
                </div>
                <div style={styles.modalCard}>
                  <h4 style={styles.modalCardTitle}>Credits</h4>
                  <p style={{...styles.modalCardValue, color: selectedCourse.color}}>{selectedCourse.credits}</p>
                </div>
              </div>

              <div style={styles.modalSection}>
                <h4 style={styles.modalSectionTitle}>Instructor</h4>
                <p style={styles.modalSectionContent}>{selectedCourse.instructor}</p>
              </div>

              <div style={styles.modalSection}>
                <h4 style={styles.modalSectionTitle}>Recent Submissions</h4>
                <ul style={styles.submissionsList}>
                  <li>✅ Assignment 5 - Submitted (95%)</li>
                  <li>✅ Quiz 3 - Completed (92%)</li>
                  <li>⏳ Project 2 - In Progress</li>
                </ul>
              </div>

              <div style={styles.modalActions}>
                <button style={{...styles.primaryBtn, backgroundColor: selectedCourse.color}}>View Full Details</button>
                <button style={styles.secondaryBtn}>Download Materials</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "40px",
    gap: "20px",
  },
  heading: {
    fontSize: "42px",
    fontWeight: "800",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    marginBottom: "12px",
  },
  subtitle: {
    fontSize: "18px",
    color: "#6b7280",
    fontWeight: "500",
  },
  addBtn: {
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    padding: "12px 28px",
    borderRadius: "10px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  filterSection: {
    display: "flex",
    gap: "15px",
    marginBottom: "30px",
  },
  searchInput: {
    flex: 1,
    padding: "12px 18px",
    borderRadius: "10px",
    border: "2px solid #e5e7eb",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.3s ease",
    outline: "none",
  },
  filterSelect: {
    padding: "12px 18px",
    borderRadius: "10px",
    border: "2px solid #e5e7eb",
    backgroundColor: "white",
    cursor: "pointer",
    fontWeight: "600",
    outline: "none",
  },
  coursesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "25px",
  },
  courseCard: {
    backgroundColor: "white",
    padding: "28px",
    borderRadius: "16px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
    border: "1px solid #f0f0f0",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
  },
  courseHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: "15px",
    marginBottom: "20px",
  },
  courseIconBox: {
    width: "55px",
    height: "55px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "26px",
    flexShrink: 0,
  },
  courseIcon: {
    fontSize: "26px",
  },
  courseHeaderInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1f2937",
    margin: "0 0 6px 0",
  },
  instructor: {
    fontSize: "13px",
    color: "#6b7280",
    margin: 0,
    fontWeight: "500",
  },
  gradeLabel: {
    padding: "6px 12px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "700",
  },
  courseStats: {
    marginBottom: "20px",
  },
  statItem: {
    marginBottom: "15px",
  },
  statLabel: {
    fontSize: "12px",
    color: "#9ca3af",
    fontWeight: "700",
    textTransform: "uppercase",
    display: "block",
    marginBottom: "6px",
  },
  progressBar: {
    height: "6px",
    borderRadius: "3px",
    backgroundColor: "#e5e7eb",
    overflow: "hidden",
    marginBottom: "6px",
  },
  progressFill: {
    height: "100%",
    transition: "width 0.6s ease-out",
  },
  statValue: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#1f2937",
  },
  statRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
  },
  courseActions: {
    display: "flex",
    gap: "10px",
  },
  actionBtn: {
    flex: 1,
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "13px",
    transition: "all 0.3s ease",
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    color: "#1f2937",
    border: "1px solid #e5e7eb",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "13px",
    transition: "all 0.3s ease",
  },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    animation: "fadeIn 0.3s ease-out",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: "20px",
    width: "90%",
    maxWidth: "600px",
    maxHeight: "85vh",
    overflow: "auto",
    position: "relative",
    boxShadow: "0 25px 80px rgba(0, 0, 0, 0.2)",
    animation: "slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  closeBtn: {
    position: "absolute",
    top: "20px",
    right: "20px",
    backgroundColor: "transparent",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#6b7280",
    zIndex: 10,
  },
  modalHeader: {
    padding: "30px",
    borderBottom: "1px solid #f0f0f0",
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  modalIcon: {
    fontSize: "36px",
  },
  modalTitle: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#1f2937",
    margin: 0,
  },
  modalBody: {
    padding: "30px",
  },
  modalGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
    marginBottom: "25px",
  },
  modalCard: {
    backgroundColor: "#f9fafb",
    padding: "15px",
    borderRadius: "12px",
    textAlign: "center",
  },
  modalCardTitle: {
    fontSize: "12px",
    color: "#9ca3af",
    fontWeight: "700",
    textTransform: "uppercase",
    margin: "0 0 8px 0",
  },
  modalCardValue: {
    fontSize: "28px",
    fontWeight: "800",
    margin: 0,
  },
  modalSection: {
    marginBottom: "25px",
  },
  modalSectionTitle: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: "10px",
  },
  modalSectionContent: {
    color: "#6b7280",
    margin: 0,
    fontSize: "14px",
  },
  submissionsList: {
    list: "none",
    padding: 0,
    margin: 0,
  },
  modalActions: {
    display: "flex",
    gap: "12px",
    paddingTop: "20px",
    borderTop: "1px solid #f0f0f0",
  },
  primaryBtn: {
    flex: 1,
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    transition: "all 0.3s ease",
  },
};

export default Courses;