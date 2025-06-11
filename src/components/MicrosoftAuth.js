import React, { useEffect } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider, useMsal, useIsAuthenticated, useAccount } from '@azure/msal-react';

const msalConfig = {
  auth: {
    clientId: 'YOUR_MICROSOFT_CLIENT_ID',
    redirectUri: window.location.origin,
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

const MicrosoftLoginButton = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginPopup().catch(e => {
      console.error(e);
    });
  };

  return <button onClick={handleLogin}>Login with Microsoft</button>;
};

const MicrosoftLogoutButton = () => {
  const { instance, accounts } = useMsal();

  const handleLogout = () => {
    instance.logoutPopup({
      account: accounts[0],
    });
  };

  return <button onClick={handleLogout}>Logout</button>;
};

const MicrosoftAuthContent = ({ onLoginChange }) => {
  const isAuthenticated = useIsAuthenticated();
  const account = useAccount();

  useEffect(() => {
    onLoginChange(isAuthenticated);
  }, [isAuthenticated, onLoginChange]);

  return (
    <div>
      {isAuthenticated && account ? (
        <div>
          <h3>Welcome, {account.name}</h3>
          <MicrosoftLogoutButton />
        </div>
      ) : (
        <MicrosoftLoginButton />
      )}
    </div>
  );
};

const MicrosoftAuth = ({ onLoginChange }) => (
  <MsalProvider instance={msalInstance}>
    <MicrosoftAuthContent onLoginChange={onLoginChange} />
  </MsalProvider>
);

export default MicrosoftAuth;
