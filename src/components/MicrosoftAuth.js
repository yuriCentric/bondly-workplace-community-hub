import React, { useState, useEffect } from 'react';
import { FiLogOut } from "react-icons/fi";
import { FaMicrosoft } from "react-icons/fa";

const MicrosoftAuth = ({ onLoginChange }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  const handleLogin = () => {
    // Simulate a fake login flow
    setTimeout(() => {
      setIsAuthenticated(true);
      setUserName('Demo User');
      onLoginChange(true);
    }, 500);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserName('');
    onLoginChange(false);
  };

  useEffect(() => {
    // On mount, assume not logged in
    onLoginChange(isAuthenticated);
  }, [isAuthenticated, onLoginChange]);

  return (
<div
  style={{
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    fontFamily: "sans-serif",
  }}
>
  {isAuthenticated ? (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        backgroundColor: "#f4f4f4",
        padding: "0.5rem 1rem",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <h4 style={{ margin: 0, color: "#333" }}>👋 Welcome, {userName}</h4>
      <FiLogOut
        onClick={handleLogout}
        title="Logout"
        style={{
          cursor: "pointer",
          fontSize: "1.4rem",
          color: "#dc3545",
        }}
      />
    </div>
  ) : (
    <button
      onClick={handleLogin}
      style={{
        padding: "0.6rem 1.2rem",
        fontSize: "1rem",
        backgroundColor: "#0078D4",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      <FaMicrosoft size={18} />
      Login with Microsoft (Demo)
    </button>
  )}
</div>
  );
};

export default MicrosoftAuth;
