import React, { useState } from "react";

function Counter() {
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

      <div style={styles.counterBox}>{count}</div>

      <div>
        <button style={{ ...styles.btn, ...styles.inc }} onClick={increment}>
          Increment
        </button>

        <button style={{ ...styles.btn, ...styles.dec }} onClick={decrement}>
          Decrement
        </button>

        <button style={{ ...styles.btn, ...styles.reset }} onClick={reset}>
          Reset
        </button>
      </div>

      <p style={styles.message}>{message}</p>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "60px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    color: "#4b0082",
  },
  counterBox: {
    fontSize: "60px",
    fontWeight: "bold",
    color: "#ffffff",
    background: "linear-gradient(135deg, #6a11cb, #2575fc)",
    width: "120px",
    margin: "20px auto",
    borderRadius: "12px",
    padding: "15px",
  },
  btn: {
    padding: "10px 18px",
    margin: "8px",
    fontSize: "16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  inc: {
    backgroundColor: "#28a745",
    color: "white",
  },
  dec: {
    backgroundColor: "#dc3545",
    color: "white",
  },
  reset: {
    backgroundColor: "#ffc107",
    color: "black",
  },
  message: {
    marginTop: "15px",
    fontSize: "18px",
    color: "#ff6600",
    fontWeight: "bold",
  },
};

export default Counter;
