import { useState, useEffect } from "react";

function Dashboard() {
  const [stats, setStats] = useState([
    { label: "Attendance", value: "92%", icon: "📍", color: "#667eea", bgColor: "#ede9fe", trend: "+2%" },
    { label: "Assignments", value: "18/20", icon: "✅", color: "#10b981", bgColor: "#d1fae5", trend: "+1" },
    { label: "Current GPA", value: "8.5", icon: "⭐", color: "#f59e0b", bgColor: "#fef3c7", trend: "+0.2" },
    { label: "Overall Score", value: "87%", icon: "🎯", color: "#ec4899", bgColor: "#fce7f3", trend: "+3%" },
  ]);

  const [activities, setActivities] = useState([
    { id: 1, type: "assignment", title: "Data Structures Assignment 5", date: "Today", icon: "📝", status: "Submitted" },
    { id: 2, type: "grade", title: "Web Technologies - Quiz 3 (95%)", date: "Yesterday", icon: "✅", status: "Graded" },
    { id: 3, type: "deadline", title: "DBMS Project Due", date: "In 2 days", icon: "⏰", status: "In Progress" },
    { id: 4, type: "announcement", title: "New lecture notes uploaded", date: "2 days ago", icon: "📢", status: "New" },
  ]);

  const [upcomingDeadlines, setUpcomingDeadlines] = useState([
    { id: 1, title: "Software Engineering Documentation", dueDate: "Feb 8, 2026", priority: "High" },
    { id: 2, title: "DBMS Final Project Submission", dueDate: "Feb 12, 2026", priority: "High" },
    { id: 3, title: "Data Structures Assignment 6", dueDate: "Feb 15, 2026", priority: "Medium" },
  ]);

  const [hoveredCard, setHoveredCard] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    showNotification("✓ Dashboard loaded successfully!", "success");
  }, []);

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
          <h1 style={styles.heading}>📊 Dashboard</h1>
          <p style={styles.subtitle}>Welcome back! Your academic performance at a glance</p>
        </div>
        <div style={styles.headerActions}>
          <button style={styles.refreshBtn} onClick={() => showNotification("🔄 Dashboard refreshed!", "info")}>🔄 Refresh</button>
          <button style={styles.settingsBtn} onClick={() => showNotification("Opening settings...", "info")}>⚙️ Settings</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div
            key={index}
            style={{
              ...styles.card,
              transform: hoveredCard === index ? "translateY(-8px)" : "translateY(0)",
              boxShadow: hoveredCard === index ? `0 20px 50px ${stat.color}40` : "0 10px 40px rgba(0, 0, 0, 0.08)",
              animation: `slideUp 0.5s ease-out ${index * 0.1}s both`,
            }}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={{...styles.cardIconBox, backgroundColor: stat.bgColor}}>
              {stat.icon}
            </div>
            <div style={styles.cardLabel}>{stat.label}</div>
            <div style={{...styles.cardValue, color: stat.color}}>{stat.value}</div>
            <div style={{...styles.cardTrend, color: stat.color}}>{stat.trend}</div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div style={styles.mainGrid}>
        {/* Recent Activities */}
        <div style={{...styles.section, animation: "slideUp 0.6s ease-out 0.2s both"}}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>📋 Recent Activities</h2>
            <a href="#" style={styles.viewAll} onClick={() => showNotification("Loading all activities...", "info")}>View All →</a>
          </div>
          <div style={styles.activitiesList}>
            {activities.map((activity, idx) => (
              <div key={activity.id} style={{...styles.activityItem, animation: `slideInLeft 0.4s ease-out ${0.3 + idx * 0.08}s both`}}>
                <div style={styles.activityIcon}>{activity.icon}</div>
                <div style={styles.activityContent}>
                  <h4 style={styles.activityTitle}>{activity.title}</h4>
                  <p style={styles.activityDate}>{activity.date}</p>
                </div>
                <span style={{...styles.activityBadge, backgroundColor: activity.status === "Submitted" || activity.status === "Graded" ? "#d1fae5" : activity.status === "In Progress" ? "#fef3c7" : "#ede9fe", color: activity.status === "Submitted" || activity.status === "Graded" ? "#059669" : activity.status === "In Progress" ? "#b45309" : "#7c3aed"}}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div style={{...styles.section, animation: "slideUp 0.6s ease-out 0.3s both"}}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>⏰ Upcoming Deadlines</h2>
            <a href="#" style={styles.viewAll} onClick={() => showNotification("Opening calendar view...", "info")}>View Calendar →</a>
          </div>
          <div style={styles.deadlinesList}>
            {upcomingDeadlines.map((deadline, index) => (
              <div key={deadline.id} style={{...styles.deadlineItem, animation: `slideInRight 0.5s ease-out ${0.4 + index * 0.1}s both`}}>
                <div style={styles.deadlineLeft}>
                  <h4 style={styles.deadlineTitle}>{deadline.title}</h4>
                  <p style={styles.deadlineDate}>📅 {deadline.dueDate}</p>
                </div>
                <span style={{
                  ...styles.priorityBadge,
                  backgroundColor: deadline.priority === "High" ? "#fee2e2" : "#fef3c7",
                  color: deadline.priority === "High" ? "#991b1b" : "#b45309"
                }}>
                  {deadline.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{...styles.quickStats, animation: "slideUp 0.6s ease-out 0.4s both"}}>
        {[
          { label: "Study Time This Week", value: "18.5 hrs", delay: "0s" },
          { label: "Assignments Completed", value: "18 / 20", delay: "0.1s" },
          { label: "Average Score", value: "87%", delay: "0.2s" },
        ].map((stat, idx) => (
          <div key={idx} style={{...styles.quickStatItem, animation: `slideUp 0.5s ease-out ${0.5 + idx * 0.08}s both`}}>
            <span style={styles.quickStatLabel}>{stat.label}</span>
            <span style={styles.quickStatValue}>{stat.value}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(-30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>📊 Dashboard</h1>
          <p style={styles.subtitle}>Welcome back! Your academic performance at a glance</p>
        </div>
        <div style={styles.headerActions}>
          <button style={styles.refreshBtn}>🔄 Refresh</button>
          <button style={styles.settingsBtn}>⚙️ Settings</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div
            key={index}
            style={{
              ...styles.card,
              transform: hoveredCard === index ? "translateY(-8px)" : "translateY(0)",
              boxShadow: hoveredCard === index ? "0 20px 50px rgba(0, 0, 0, 0.15)" : "0 10px 40px rgba(0, 0, 0, 0.08)",
              animation: `slideUp 0.5s ease-out ${index * 0.1}s both`,
            }}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={{...styles.cardIconBox, backgroundColor: stat.bgColor}}>
              {stat.icon}
            </div>
            <div style={styles.cardLabel}>{stat.label}</div>
            <div style={{...styles.cardValue, color: stat.color}}>{stat.value}</div>
            <div style={{...styles.cardTrend, color: stat.color}}>{stat.trend}</div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div style={styles.mainGrid}>
        {/* Recent Activities */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>📋 Recent Activities</h2>
            <a href="#" style={styles.viewAll}>View All →</a>
          </div>
          <div style={styles.activitiesList}>
            {activities.map((activity) => (
              <div key={activity.id} style={styles.activityItem}>
                <div style={styles.activityIcon}>{activity.icon}</div>
                <div style={styles.activityContent}>
                  <h4 style={styles.activityTitle}>{activity.title}</h4>
                  <p style={styles.activityDate}>{activity.date}</p>
                </div>
                <span style={{...styles.activityBadge, backgroundColor: activity.status === "Submitted" || activity.status === "Graded" ? "#d1fae5" : activity.status === "In Progress" ? "#fef3c7" : "#ede9fe", color: activity.status === "Submitted" || activity.status === "Graded" ? "#059669" : activity.status === "In Progress" ? "#b45309" : "#7c3aed"}}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>⏰ Upcoming Deadlines</h2>
            <a href="#" style={styles.viewAll}>View Calendar →</a>
          </div>
          <div style={styles.deadlinesList}>
            {upcomingDeadlines.map((deadline, index) => (
              <div key={deadline.id} style={{...styles.deadlineItem, animation: `slideIn 0.5s ease-out ${0.3 + index * 0.1}s both`}}>
                <div style={styles.deadlineLeft}>
                  <h4 style={styles.deadlineTitle}>{deadline.title}</h4>
                  <p style={styles.deadlineDate}>📅 {deadline.dueDate}</p>
                </div>
                <span style={{
                  ...styles.priorityBadge,
                  backgroundColor: deadline.priority === "High" ? "#fee2e2" : "#fef3c7",
                  color: deadline.priority === "High" ? "#991b1b" : "#b45309"
                }}>
                  {deadline.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={styles.quickStats}>
        <div style={styles.quickStatItem}>
          <span style={styles.quickStatLabel}>Study Time This Week</span>
          <span style={styles.quickStatValue}>18.5 hrs</span>
        </div>
        <div style={styles.quickStatItem}>
          <span style={styles.quickStatLabel}>Assignments Completed</span>
          <span style={styles.quickStatValue}>18 / 20</span>
        </div>
        <div style={styles.quickStatItem}>
          <span style={styles.quickStatLabel}>Average Score</span>
          <span style={styles.quickStatValue}>87%</span>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
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
    marginBottom: "50px",
    flexWrap: "wrap",
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
  headerActions: {
    display: "flex",
    gap: "12px",
  },
  refreshBtn: {
    padding: "12px 24px",
    borderRadius: "10px",
    border: "2px solid #e5e7eb",
    backgroundColor: "white",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.3s ease",
  },
  settingsBtn: {
    padding: "12px 24px",
    borderRadius: "10px",
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.3s ease",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "25px",
    marginBottom: "50px",
  },
  card: {
    backgroundColor: "white",
    padding: "30px 25px",
    borderRadius: "18px",
    textAlign: "center",
    cursor: "pointer",
    border: "1px solid #f0f0f0",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    overflow: "hidden",
  },
  cardIconBox: {
    width: "65px",
    height: "65px",
    margin: "0 auto 18px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
  },
  cardLabel: {
    fontSize: "15px",
    color: "#9ca3af",
    marginBottom: "10px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  cardValue: {
    fontSize: "34px",
    fontWeight: "800",
    marginBottom: "8px",
  },
  cardTrend: {
    fontSize: "14px",
    fontWeight: "700",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "30px",
    marginBottom: "40px",
  },
  section: {
    backgroundColor: "white",
    padding: "35px",
    borderRadius: "18px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
    border: "1px solid #f0f0f0",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1f2937",
    margin: 0,
  },
  viewAll: {
    color: "#667eea",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.3s ease",
  },
  activitiesList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  activityItem: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "15px",
    backgroundColor: "#f9fafb",
    borderRadius: "12px",
    transition: "all 0.3s ease",
  },
  activityIcon: {
    fontSize: "24px",
    minWidth: "40px",
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#1f2937",
    margin: "0 0 4px 0",
  },
  activityDate: {
    fontSize: "12px",
    color: "#9ca3af",
    margin: 0,
  },
  activityBadge: {
    padding: "6px 12px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },
  deadlinesList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  deadlineItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px",
    backgroundColor: "#f9fafb",
    borderRadius: "12px",
    borderLeft: "4px solid #667eea",
    transition: "all 0.3s ease",
  },
  deadlineLeft: {
    flex: 1,
  },
  deadlineTitle: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#1f2937",
    margin: "0 0 6px 0",
  },
  deadlineDate: {
    fontSize: "13px",
    color: "#6b7280",
    margin: 0,
  },
  priorityBadge: {
    padding: "6px 14px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },
  quickStats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "18px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
    border: "1px solid #f0f0f0",
  },
  quickStatItem: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  quickStatLabel: {
    fontSize: "13px",
    color: "#9ca3af",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  quickStatValue: {
    fontSize: "28px",
    fontWeight: "800",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  notification: {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "16px 20px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
    zIndex: 2000,
    minWidth: "280px",
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
  notification_error: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    borderLeft: "4px solid #dc2626",
  },
  notificationText: {
    fontWeight: "600",
    fontSize: "14px",
    flex: 1,
  },
  notificationClose: {
    backgroundColor: "transparent",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    color: "inherit",
    padding: "0",
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  },
};

export default Dashboard;