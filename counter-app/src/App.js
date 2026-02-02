import React, { useState } from "react";

function App() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("");

  const increment = () => {
    if (count + 1 === 10) setMessage("🎉 You reached 10!");
    else setMessage("");
    setCount(count + 1);
  };

  const decrement = () => {
    if (count > 0) setCount(count - 1);
  };

  const reset = () => {
    setCount(0);
    setMessage("");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Counter App</h1>

      <div style={styles.counter}>{count}</div>

      <button style={{ ...styles.btn, backgroundColor: "#28a745" }} onClick={increment}>
        Increment
      </button>

      <button style={{ ...styles.btn, backgroundColor: "#dc3545" }} onClick={decrement}>
        Decrement
      </button>

      <button style={{ ...styles.btn, backgroundColor: "#ffc107", color: "black" }} onClick={reset}>
        Reset
      </button>

      <p style={styles.message}>{message}</p>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "60px",
    fontFamily: "Arial",
  },
  title: {
    color: "#4b0082",
  },
  counter: {
    fontSize: "60px",
    margin: "20px",
    color: "white",
    background: "linear-gradient(135deg, #6a11cb, #2575fc)",
    width: "120px",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: "10px",
    padding: "10px",
  },
  btn: {
    padding: "10px 18px",
    margin: "8px",
    fontSize: "16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    color: "white",
  },
  message: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#ff6600",
    marginTop: "15px",
  },
};

export default App;
