import React, { useState, useEffect } from 'react';

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
    <div>
      {isAuthenticated ? (
        <div>
          <h3>Welcome, {userName}</h3>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login with Microsoft (Demo)</button>
      )}
    </div>
  );
};

export default MicrosoftAuth;
