import { useState } from "react";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState(null);
  const [profileData, setProfileData] = useState({
    name: "Rahul Kumar",
    email: "rahul@student.edu",
    department: "Computer Science",
    studentId: "CS2024001",
    semester: "6th Semester",
    joinDate: "January 2022",
    phone: "+91 98765 43210",
    address: "New Delhi, India",
    gpa: "8.5",
  });

  const [editData, setEditData] = useState(profileData);
  const [achievements, setAchievements] = useState([
    { id: 1, title: "Perfect Attendance", icon: "🎖️", date: "Dec 2025" },
    { id: 2, title: "Dean's List", icon: "🏆", date: "Nov 2025" },
    { id: 3, title: "Best Project Award", icon: "⭐", date: "Oct 2025" },
  ]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setProfileData(editData);
      setIsEditing(false);
      setIsSaving(false);
      showNotification("✓ Profile updated successfully!", "success");
    }, 1200);
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
    showNotification("Changes cancelled", "info");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>👤 Student Profile</h1>

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

      {/* Profile Header Card */}
      <div style={{...styles.profileCard, animation: "slideUp 0.6s ease-out"}}>
        <div style={styles.profileHeader}>
          <div style={styles.avatar}>
            <div style={styles.avatarInner}>{profileData.name.charAt(0)}</div>
          </div>
          <div style={styles.profileHeaderText}>
            <h2 style={styles.profileName}>{profileData.name}</h2>
            <p style={styles.profileDept}>{profileData.department}</p>
            <div style={styles.statusBadges}>
              <span style={styles.statusBadge}>✓ Active Student</span>
              <span style={{...styles.statusBadge, backgroundColor: "#fef3c7", color: "#b45309"}}>📚 {profileData.semester}</span>
            </div>
          </div>
          <div style={styles.buttonGroup}>
            {isEditing ? (
              <>
                <button 
                  style={{...styles.editProfileBtn, opacity: isSaving ? 0.7 : 1}}
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? "💫 Saving..." : "✓ Save"}
                </button>
                <button 
                  style={styles.cancelBtn}
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  ✕ Cancel
                </button>
              </>
            ) : (
              <button 
                style={styles.editProfileBtn}
                onClick={() => setIsEditing(true)}
              >
                ✏️ Edit
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabsContainer}>
          {["info", "academics", "achievements"].map((tab) => (
            <button
              key={tab}
              style={{
                ...styles.tab,
                borderBottom: activeTab === tab ? "3px solid #667eea" : "none",
                color: activeTab === tab ? "#667eea" : "#6b7280",
                transform: activeTab === tab ? "translateY(2px)" : "translateY(0)",
              }}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "info" && "📋 Information"}
              {tab === "academics" && "📈 Academics"}
              {tab === "achievements" && "🏆 Achievements"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{...styles.tabContent, animation: "fadeIn 0.4s ease-out"}}>
          {activeTab === "info" && (
            <div>
              <div style={styles.detailsGrid}>
                {isEditing ? (
                  <>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Full Name</label>
                      <input
                        style={styles.formInput}
                        value={editData.name}
                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Email</label>
                      <input
                        style={styles.formInput}
                        value={editData.email}
                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                        placeholder="Enter your email"
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Phone</label>
                      <input
                        style={styles.formInput}
                        value={editData.phone}
                        onChange={(e) => setEditData({...editData, phone: e.target.value})}
                        placeholder="Enter your phone"
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Address</label>
                      <input
                        style={styles.formInput}
                        value={editData.address}
                        onChange={(e) => setEditData({...editData, address: e.target.value})}
                        placeholder="Enter your address"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{...styles.detailItem, animation: "slideUp 0.3s ease-out"}}>
                      <label style={styles.label}>📚 Student ID</label>
                      <p style={styles.value}>{profileData.studentId}</p>
                    </div>
                    <div style={{...styles.detailItem, animation: "slideUp 0.35s ease-out"}}>
                      <label style={styles.label}>📧 Email</label>
                      <p style={styles.value}>{profileData.email}</p>
                    </div>
                    <div style={{...styles.detailItem, animation: "slideUp 0.4s ease-out"}}>
                      <label style={styles.label}>📞 Phone</label>
                      <p style={styles.value}>{profileData.phone}</p>
                    </div>
                    <div style={{...styles.detailItem, animation: "slideUp 0.45s ease-out"}}>
                      <label style={styles.label}>📍 Address</label>
                      <p style={styles.value}>{profileData.address}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === "academics" && (
            <div>
              <div style={styles.academicsGrid}>
                {[
                  { title: "Current GPA", value: profileData.gpa, subtext: "Out of 10.0", delay: "0s" },
                  { title: "Total Credits", value: "87", subtext: "Completed", delay: "0.1s" },
                  { title: "Avg Score", value: "87%", subtext: "All Courses", delay: "0.2s" },
                  { title: "Semester", value: "6th", subtext: "Current", delay: "0.3s" },
                ].map((card, idx) => (
                  <div key={idx} style={{...styles.academicCard, animation: `slideUp 0.5s ease-out ${card.delay}`}}>
                    <h4 style={styles.academicCardTitle}>{card.title}</h4>
                    <p style={styles.academicCardValue}>{card.value}</p>
                    <p style={styles.academicCardSubtext}>{card.subtext}</p>
                  </div>
                ))}
              </div>

              <div style={styles.academicSection}>
                <h3 style={styles.academicSectionTitle}>Course Performance</h3>
                <div style={styles.performanceList}>
                  {[
                    { course: "Data Structures", grade: "A-", score: "92%", delay: "0.1s" },
                    { course: "Web Technologies", grade: "A", score: "95%", delay: "0.2s" },
                    { course: "DBMS", grade: "B+", score: "87%", delay: "0.3s" },
                    { course: "Software Engineering", grade: "A-", score: "90%", delay: "0.4s" },
                  ].map((item, index) => (
                    <div key={index} style={{...styles.performanceItem, animation: `slideInLeft 0.5s ease-out ${item.delay}`}}>
                      <span style={styles.performanceCourse}>{item.course}</span>
                      <span style={styles.performanceGrade}>{item.grade}</span>
                      <span style={styles.performanceScore}>{item.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "achievements" && (
            <div>
              <div style={styles.achievementsGrid}>
                {achievements.map((achievement, idx) => (
                  <div key={achievement.id} style={{...styles.achievementCard, animation: `scaleUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 0.1}s both`}}>
                    <div style={styles.achievementIcon}>{achievement.icon}</div>
                    <h4 style={styles.achievementTitle}>{achievement.title}</h4>
                    <p style={styles.achievementDate}>{achievement.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
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
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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
    maxWidth: "900px",
    margin: "0 auto",
    position: "relative",
  },
  heading: {
    fontSize: "42px",
    fontWeight: "800",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    marginBottom: "40px",
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
    animation: "slideInDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
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
    color: "inherit",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "bold",
    transition: "all 0.2s ease",
  },
  profileCard: {
    backgroundColor: "white",
    borderRadius: "20px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.12)",
    border: "1px solid #f0f0f0",
    overflow: "hidden",
  },
  profileHeader: {
    padding: "40px",
    borderBottom: "1px solid #f0f0f0",
    display: "flex",
    alignItems: "center",
    gap: "25px",
    position: "relative",
    transition: "all 0.3s ease",
  },
  avatar: {
    width: "100px",
    height: "100px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)",
    position: "relative",
  },
  avatarInner: {
    width: "100%",
    height: "100%",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "44px",
    fontWeight: "700",
    color: "white",
  },
  profileHeaderText: {
    flex: 1,
  },
  profileName: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#1f2937",
    margin: "0 0 8px 0",
  },
  profileDept: {
    fontSize: "16px",
    color: "#6b7280",
    margin: "0 0 12px 0",
    fontWeight: "500",
  },
  statusBadges: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  statusBadge: {
    display: "inline-block",
    backgroundColor: "#d1fae5",
    color: "#059669",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "700",
  },
  buttonGroup: {
    display: "flex",
    gap: "12px",
  },
  editProfileBtn: {
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    padding: "12px 28px",
    borderRadius: "10px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    whiteSpace: "nowrap",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
  },
  cancelBtn: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    border: "none",
    padding: "12px 28px",
    borderRadius: "10px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
    whiteSpace: "nowrap",
  },
  tabsContainer: {
    display: "flex",
    borderBottom: "1px solid #f0f0f0",
    padding: "0 40px",
    gap: "0",
  },
  tab: {
    backgroundColor: "transparent",
    border: "none",
    padding: "20px 30px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    textTransform: "uppercase",
    letterSpacing: "0.3px",
  },
  tabContent: {
    padding: "40px",
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "30px",
  },
  detailItem: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "12px",
    color: "#9ca3af",
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: "10px",
    letterSpacing: "0.3px",
  },
  value: {
    fontSize: "18px",
    color: "#1f2937",
    fontWeight: "700",
    margin: 0,
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  formLabel: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#1f2937",
    textTransform: "uppercase",
  },
  formInput: {
    padding: "12px",
    borderRadius: "8px",
    border: "2px solid #e5e7eb",
    fontSize: "14px",
    fontWeight: "500",
    outline: "none",
    transition: "all 0.3s ease",
  },
  academicsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
  },
  academicCard: {
    backgroundColor: "#f9fafb",
    padding: "25px",
    borderRadius: "12px",
    textAlign: "center",
    border: "1px solid #f0f0f0",
    transition: "all 0.3s ease",
  },
  academicCardTitle: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#9ca3af",
    textTransform: "uppercase",
    marginBottom: "10px",
  },
  academicCardValue: {
    fontSize: "32px",
    fontWeight: "800",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    margin: "0 0 5px 0",
  },
  academicCardSubtext: {
    fontSize: "12px",
    color: "#6b7280",
    margin: 0,
  },
  academicSection: {
    marginTop: "30px",
  },
  academicSectionTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: "20px",
  },
  performanceList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  performanceItem: {
    display: "grid",
    gridTemplateColumns: "1fr auto auto",
    gap: "20px",
    padding: "15px",
    backgroundColor: "#f9fafb",
    borderRadius: "10px",
    alignItems: "center",
    transition: "all 0.3s ease",
  },
  performanceCourse: {
    fontWeight: "600",
    color: "#1f2937",
  },
  performanceGrade: {
    padding: "6px 12px",
    backgroundColor: "#ede9fe",
    color: "#667eea",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "13px",
  },
  performanceScore: {
    fontWeight: "700",
    color: "#10b981",
  },
  achievementsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "20px",
  },
  achievementCard: {
    backgroundColor: "#f9fafb",
    padding: "25px",
    borderRadius: "12px",
    textAlign: "center",
    border: "1px solid #f0f0f0",
    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
  achievementIcon: {
    fontSize: "48px",
    marginBottom: "15px",
    transition: "transform 0.3s ease",
  },
  achievementTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: "8px",
  },
  achievementDate: {
    fontSize: "12px",
    color: "#6b7280",
    margin: 0,
  },
};

export default Profile;
      <h1 style={styles.heading}>👤 Student Profile</h1>

      {/* Profile Header Card */}
      <div style={{...styles.profileCard, animation: "slideUp 0.6s ease-out"}}>
        <div style={styles.profileHeader}>
          <div style={styles.avatar}>
            <div style={styles.avatarInner}>{profileData.name.charAt(0)}</div>
          </div>
          <div style={styles.profileHeaderText}>
            <h2 style={styles.profileName}>{profileData.name}</h2>
            <p style={styles.profileDept}>{profileData.department}</p>
            <div style={styles.statusBadges}>
              <span style={styles.statusBadge}>✓ Active Student</span>
              <span style={{...styles.statusBadge, backgroundColor: "#fef3c7", color: "#b45309"}}>📚 {profileData.semester}</span>
            </div>
          </div>
          <button 
            style={styles.editProfileBtn}
            onClick={() => !isEditing ? setIsEditing(true) : handleSave()}
          >
            {isEditing ? "✓ Save" : "✏️ Edit"}
          </button>
        </div>

        {/* Tabs */}
        <div style={styles.tabsContainer}>
          {["info", "academics", "achievements"].map((tab) => (
            <button
              key={tab}
              style={{
                ...styles.tab,
                borderBottom: activeTab === tab ? "3px solid #667eea" : "none",
                color: activeTab === tab ? "#667eea" : "#6b7280",
              }}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "info" && "📋 Information"}
              {tab === "academics" && "📈 Academics"}
              {tab === "achievements" && "🏆 Achievements"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={styles.tabContent}>
          {activeTab === "info" && (
            <div>
              <div style={styles.detailsGrid}>
                {isEditing ? (
                  <>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Full Name</label>
                      <input
                        style={styles.formInput}
                        value={editData.name}
                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Email</label>
                      <input
                        style={styles.formInput}
                        value={editData.email}
                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Phone</label>
                      <input
                        style={styles.formInput}
                        value={editData.phone}
                        onChange={(e) => setEditData({...editData, phone: e.target.value})}
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Address</label>
                      <input
                        style={styles.formInput}
                        value={editData.address}
                        onChange={(e) => setEditData({...editData, address: e.target.value})}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div style={styles.detailItem}>
                      <label style={styles.label}>📚 Student ID</label>
                      <p style={styles.value}>{profileData.studentId}</p>
                    </div>
                    <div style={styles.detailItem}>
                      <label style={styles.label}>📧 Email</label>
                      <p style={styles.value}>{profileData.email}</p>
                    </div>
                    <div style={styles.detailItem}>
                      <label style={styles.label}>📞 Phone</label>
                      <p style={styles.value}>{profileData.phone}</p>
                    </div>
                    <div style={styles.detailItem}>
                      <label style={styles.label}>📍 Address</label>
                      <p style={styles.value}>{profileData.address}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === "academics" && (
            <div>
              <div style={styles.academicsGrid}>
                <div style={styles.academicCard}>
                  <h4 style={styles.academicCardTitle}>Current GPA</h4>
                  <p style={styles.academicCardValue}>{profileData.gpa}</p>
                  <p style={styles.academicCardSubtext}>Out of 10.0</p>
                </div>
                <div style={styles.academicCard}>
                  <h4 style={styles.academicCardTitle}>Total Credits</h4>
                  <p style={styles.academicCardValue}>87</p>
                  <p style={styles.academicCardSubtext}>Completed</p>
                </div>
                <div style={styles.academicCard}>
                  <h4 style={styles.academicCardTitle}>Avg Score</h4>
                  <p style={styles.academicCardValue}>87%</p>
                  <p style={styles.academicCardSubtext}>All Courses</p>
                </div>
                <div style={styles.academicCard}>
                  <h4 style={styles.academicCardTitle}>Semester</h4>
                  <p style={styles.academicCardValue}>6th</p>
                  <p style={styles.academicCardSubtext}>Current</p>
                </div>
              </div>

              <div style={styles.academicSection}>
                <h3 style={styles.academicSectionTitle}>Course Performance</h3>
                <div style={styles.performanceList}>
                  {[
                    { course: "Data Structures", grade: "A-", score: "92%" },
                    { course: "Web Technologies", grade: "A", score: "95%" },
                    { course: "DBMS", grade: "B+", score: "87%" },
                    { course: "Software Engineering", grade: "A-", score: "90%" },
                  ].map((item, index) => (
                    <div key={index} style={styles.performanceItem}>
                      <span style={styles.performanceCourse}>{item.course}</span>
                      <span style={styles.performanceGrade}>{item.grade}</span>
                      <span style={styles.performanceScore}>{item.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "achievements" && (
            <div>
              <div style={styles.achievementsGrid}>
                {achievements.map((achievement) => (
                  <div key={achievement.id} style={styles.achievementCard}>
                    <div style={styles.achievementIcon}>{achievement.icon}</div>
                    <h4 style={styles.achievementTitle}>{achievement.title}</h4>
                    <p style={styles.achievementDate}>{achievement.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
  },
  heading: {
    fontSize: "42px",
    fontWeight: "800",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    marginBottom: "40px",
  },
  profileCard: {
    backgroundColor: "white",
    borderRadius: "20px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.12)",
    border: "1px solid #f0f0f0",
    overflow: "hidden",
  },
  profileHeader: {
    padding: "40px",
    borderBottom: "1px solid #f0f0f0",
    display: "flex",
    alignItems: "center",
    gap: "25px",
    position: "relative",
  },
  avatar: {
    width: "100px",
    height: "100px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)",
    position: "relative",
  },
  avatarInner: {
    width: "100%",
    height: "100%",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "44px",
    fontWeight: "700",
    color: "white",
  },
  profileHeaderText: {
    flex: 1,
  },
  profileName: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#1f2937",
    margin: "0 0 8px 0",
  },
  profileDept: {
    fontSize: "16px",
    color: "#6b7280",
    margin: "0 0 12px 0",
    fontWeight: "500",
  },
  statusBadges: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  statusBadge: {
    display: "inline-block",
    backgroundColor: "#d1fae5",
    color: "#059669",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "700",
  },
  editProfileBtn: {
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    padding: "12px 28px",
    borderRadius: "10px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
    whiteSpace: "nowrap",
  },
  tabsContainer: {
    display: "flex",
    borderBottom: "1px solid #f0f0f0",
    padding: "0 40px",
    gap: "0",
  },
  tab: {
    backgroundColor: "transparent",
    border: "none",
    padding: "20px 30px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
    transition: "all 0.3s ease",
    textTransform: "uppercase",
    letterSpacing: "0.3px",
  },
  tabContent: {
    padding: "40px",
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "30px",
  },
  detailItem: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "12px",
    color: "#9ca3af",
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: "10px",
    letterSpacing: "0.3px",
  },
  value: {
    fontSize: "18px",
    color: "#1f2937",
    fontWeight: "700",
    margin: 0,
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  formLabel: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#1f2937",
    textTransform: "uppercase",
  },
  formInput: {
    padding: "12px",
    borderRadius: "8px",
    border: "2px solid #e5e7eb",
    fontSize: "14px",
    fontWeight: "500",
    outline: "none",
    transition: "all 0.3s ease",
  },
  academicsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
  },
  academicCard: {
    backgroundColor: "#f9fafb",
    padding: "25px",
    borderRadius: "12px",
    textAlign: "center",
    border: "1px solid #f0f0f0",
  },
  academicCardTitle: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#9ca3af",
    textTransform: "uppercase",
    marginBottom: "10px",
  },
  academicCardValue: {
    fontSize: "32px",
    fontWeight: "800",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    margin: "0 0 5px 0",
  },
  academicCardSubtext: {
    fontSize: "12px",
    color: "#6b7280",
    margin: 0,
  },
  academicSection: {
    marginTop: "30px",
  },
  academicSectionTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: "20px",
  },
  performanceList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  performanceItem: {
    display: "grid",
    gridTemplateColumns: "1fr auto auto",
    gap: "20px",
    padding: "15px",
    backgroundColor: "#f9fafb",
    borderRadius: "10px",
    alignItems: "center",
  },
  performanceCourse: {
    fontWeight: "600",
    color: "#1f2937",
  },
  performanceGrade: {
    padding: "6px 12px",
    backgroundColor: "#ede9fe",
    color: "#667eea",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "13px",
  },
  performanceScore: {
    fontWeight: "700",
    color: "#10b981",
  },
  achievementsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "20px",
  },
  achievementCard: {
    backgroundColor: "#f9fafb",
    padding: "25px",
    borderRadius: "12px",
    textAlign: "center",
    border: "1px solid #f0f0f0",
    transition: "all 0.3s ease",
  },
  achievementIcon: {
    fontSize: "48px",
    marginBottom: "15px",
  },
  achievementTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: "8px",
  },
  achievementDate: {
    fontSize: "12px",
    color: "#6b7280",
    margin: 0,
  },
};

export default Profile;