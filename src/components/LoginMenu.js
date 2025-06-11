import React, { useState } from 'react';
import GoogleAuth from './GoogleAuth';
import MicrosoftAuth from './MicrosoftAuth';

const LoginMenu = ({ onLoginChange }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLoginChange = (loggedIn) => {
    if (loggedIn) {
      setMenuOpen(false);
    }
    onLoginChange(loggedIn);
  };

  return (
    <div style={{ position: 'relative' }}>
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
          <GoogleAuth onLoginChange={handleLoginChange} />
          <MicrosoftAuth onLoginChange={handleLoginChange} />
        </div>
      )}
    </div>
  );
};

export default LoginMenu;
