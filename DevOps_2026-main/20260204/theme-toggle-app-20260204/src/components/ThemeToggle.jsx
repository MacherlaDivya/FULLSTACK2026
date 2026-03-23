import { useState } from "react";
import "./ThemeToggle.css";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("dark");

  const isDark = theme === "dark";

  const pageStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    position: "relative",
    background: isDark
      ? "linear-gradient(-45deg, #0a0e27, #16213e, #0f3460, #1a1a2e)"
      : "linear-gradient(-45deg, #f5f7ff, #e8f4ff, #f0f8ff, #e6f2ff)",
    backgroundSize: "400% 400%",
    animation: "gradientShift 15s ease infinite",
    transition: "background 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
  };

  const cardStyle = {
    width: "min(600px, 95vw)",
    borderRadius: "20px",
    padding: "40px",
    background: isDark
      ? "linear-gradient(135deg, rgba(15, 52, 96, 0.8), rgba(22, 33, 62, 0.8))"
      : "linear-gradient(135deg, rgba(245, 247, 255, 0.9), rgba(232, 244, 255, 0.9))",
    backdropFilter: "blur(10px)",
    boxShadow: isDark
      ? "0 20px 60px rgba(100, 200, 255, 0.2), inset 0 0 40px rgba(100, 200, 255, 0.05)"
      : "0 20px 60px rgba(0, 100, 200, 0.15), inset 0 0 40px rgba(0, 100, 200, 0.05)",
    border: isDark
      ? "2px solid rgba(100, 200, 255, 0.3)"
      : "2px solid rgba(0, 100, 200, 0.2)",
    transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
    animation: "floatGlow 4s ease-in-out infinite",
    color: isDark ? "rgba(100, 200, 255, 0.95)" : "rgba(20, 80, 120, 0.95)",
  };

  const titleStyle = {
    marginTop: 0,
    marginBottom: "10px",
    fontSize: "2.8em",
    fontWeight: 700,
    color: isDark ? "#00d4ff" : "#0099ff",
    textShadow: isDark
      ? "0 0 15px rgba(100, 200, 255, 0.6), 0 0 30px rgba(100, 200, 255, 0.3), 0 0 45px rgba(0, 212, 255, 0.2)"
      : "0 0 12px rgba(0, 100, 200, 0.5), 0 0 25px rgba(0, 150, 200, 0.25)",
    filter: isDark
      ? "drop-shadow(0 0 20px rgba(100, 200, 255, 0.4))"
      : "drop-shadow(0 0 15px rgba(0, 100, 200, 0.3))",
    letterSpacing: "2px",
    animation: "slideInDown 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
    transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
  };

  const descriptionStyle = {
    lineHeight: 1.8,
    fontSize: "1.05em",
    margin: "20px 0",
    opacity: 0.85,
    animation: "slideInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s backwards",
  };

  const themeInfoStyle = {
    margin: "25px 0",
    animation: "slideInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s backwards",
  };

  const badgeStyle = {
    display: "inline-block",
    padding: "8px 16px",
    borderRadius: "50px",
    fontSize: "0.9em",
    fontWeight: 700,
    background: isDark
      ? "linear-gradient(135deg, rgba(100, 200, 255, 0.2), rgba(0, 212, 255, 0.1))"
      : "linear-gradient(135deg, rgba(0, 100, 200, 0.15), rgba(0, 150, 200, 0.08))",
    border: isDark
      ? "2px solid rgba(100, 200, 255, 0.4)"
      : "2px solid rgba(0, 100, 200, 0.3)",
    color: isDark ? "#00d4ff" : "#0099ff",
    boxShadow: isDark
      ? "0 0 15px rgba(100, 200, 255, 0.3), inset 0 0 10px rgba(100, 200, 255, 0.1)"
      : "0 0 12px rgba(0, 100, 200, 0.25)",
    textShadow: isDark
      ? "0 0 10px rgba(100, 200, 255, 0.5)"
      : "0 0 8px rgba(0, 100, 200, 0.3)",
    transition: "all 0.3s ease",
    animation: "pulseGlow 2s ease-in-out infinite",
    letterSpacing: "0.5px",
  };

  const buttonContainerStyle = {
    display: "flex",
    gap: "12px",
    marginTop: "30px",
    animation: "slideInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s backwards",
  };

  const buttonStyle = {
    flex: 1,
    padding: "14px 24px",
    borderRadius: "12px",
    border: isDark
      ? "2px solid rgba(100, 200, 255, 0.4)"
      : "2px solid rgba(0, 100, 200, 0.3)",
    background: isDark
      ? "linear-gradient(135deg, rgba(100, 200, 255, 0.15), rgba(0, 212, 255, 0.08))"
      : "linear-gradient(135deg, rgba(0, 100, 200, 0.12), rgba(0, 150, 200, 0.06))",
    color: isDark ? "#64c8ff" : "#0066cc",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "1em",
    letterSpacing: "0.5px",
    transition: "all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    position: "relative",
    overflow: "hidden",
    backdropFilter: "blur(10px)",
    boxShadow: isDark
      ? "0 0 20px rgba(100, 200, 255, 0.2), inset 0 0 15px rgba(100, 200, 255, 0.08)"
      : "0 0 15px rgba(0, 100, 200, 0.15)",
    textShadow: isDark
      ? "0 0 8px rgba(100, 200, 255, 0.4)"
      : "0 0 6px rgba(0, 100, 200, 0.3)",
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>✨ THEME TOGGLE ✨</h1>

        <p style={descriptionStyle}>
          Immerse yourself in a futuristic experience with dynamic theme switching. Seamlessly transition between dark and light modes with stunning animations and advanced visual effects.
        </p>

        <div style={themeInfoStyle}>
          <p style={{ margin: 0, marginBottom: "10px" }}>
            Current Theme Mode:
          </p>
          <span style={badgeStyle}>{theme.toUpperCase()}</span>
        </div>

        <div style={buttonContainerStyle}>
          <button
            style={buttonStyle}
            onClick={toggleTheme}
            className="futuristic-button"
            title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
          >
            🌙 {isDark ? "Light" : "Dark"} Mode
          </button>
          <button
            style={buttonStyle}
            onClick={toggleTheme}
            className="futuristic-button"
            title="Toggle Theme"
          >
            ⚡ TOGGLE
          </button>
        </div>
      </div>
    </div>
  );
}