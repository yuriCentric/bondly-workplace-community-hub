import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from '@react-oauth/google';

const clientId = 'YOUR_GOOGLE_CLIENT_ID';

const GoogleAuth = ({ onLoginChange }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onLoginChange(user !== null);
  }, [user, onLoginChange]);

  const onLoginSuccess = (credentialResponse) => {
    // Decode JWT token to get user info
    const base64Url = credentialResponse.credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    const userObject = JSON.parse(jsonPayload);
    setUser(userObject);
  };

  const onLoginError = () => {
    console.log('Login Failed');
  };

  const handleLogout = () => {
    googleLogout();
    setUser(null);
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div>
        {user ? (
          <div>
            <h3>Welcome, {user.name}</h3>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <GoogleLogin onSuccess={onLoginSuccess} onError={onLoginError} />
        )}
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
