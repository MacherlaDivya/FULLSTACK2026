import { Link, NavLink } from "react-router-dom";

function NavBar() {
  return (
    <>
      <nav style={styles.nav}>
        <div style={styles.navBrand}>
          <span style={styles.brandIcon}>📚</span>
          <span style={styles.brandText}>EduHub</span>
        </div>
        <div style={styles.navLinks}>
          <NavLink to="/" style={({ isActive }) => ({
            ...styles.link,
            ...getActiveLinkStyle(isActive),
          })}>
            <span style={styles.linkIcon}>📊</span>
            Dashboard
          </NavLink>
          <NavLink to="/courses" style={({ isActive }) => ({
            ...styles.link,
            ...getActiveLinkStyle(isActive),
          })}>
            <span style={styles.linkIcon}>📚</span>
            Courses
          </NavLink>
          <NavLink to="/profile" style={({ isActive }) => ({
            ...styles.link,
            ...getActiveLinkStyle(isActive),
          })}>
            <span style={styles.linkIcon}>👤</span>
            Profile
          </NavLink>
        </div>
      </nav>
      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}

const getActiveLinkStyle = (isActive) => ({
  backgroundColor: isActive ? "rgba(255, 255, 255, 0.25)" : "transparent",
  borderBottom: isActive ? "3px solid white" : "3px solid transparent",
  paddingBottom: isActive ? "7px" : "10px",
  transform: isActive ? "scale(1.05)" : "scale(1)",
});

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 50px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    backdropFilter: "blur(10px)",
    animation: "slideDown 0.5s ease-out",
  },
  navBrand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "22px",
    fontWeight: "700",
    color: "white",
    cursor: "pointer",
  },
  brandIcon: {
    fontSize: "28px",
  },
  brandText: {
    background: "linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  navLinks: {
    display: "flex",
    gap: "15px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "15px",
    padding: "10px 24px",
    borderRadius: "12px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    position: "relative",
  },
  linkIcon: {
    fontSize: "18px",
  },
};

export default NavBar;