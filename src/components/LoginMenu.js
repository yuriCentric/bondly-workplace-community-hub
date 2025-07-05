import React, { useState } from 'react';
import GoogleAuth from './GoogleAuth';
import MicrosoftAuth from './MicrosoftAuth';

const LoginMenu = ({ onLoginChange }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLoginChange = (loggedIn) => {
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      setMenuOpen(false);
    }
    onLoginChange(loggedIn);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    onLoginChange(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      {!isLoggedIn ? (
        <>
          <button onClick={toggleMenu} style={{ padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>
            Login
          </button>
          {menuOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              padding: '10px',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              minWidth: '180px'
            }}>
              <MicrosoftAuth onLoginChange={handleLoginChange} />
            </div>
          )}
        </>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>Logged in</span>
          <button onClick={handleLogout} style={{ padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginMenu;
