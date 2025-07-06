import React, { useState } from 'react';
import Dashboard from './Dashboard';
import MicrosoftAuth from './MicrosoftAuth';

const Home = ({ isLoggedIn, setIsLoggedIn }) => {
  const handleLoginChange = (loggedIn) => {
    setIsLoggedIn(loggedIn);
  };

  return (
    <section style={{
      backgroundColor: '#f0f4f8',
      padding: '40px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      maxWidth: '900px',
      margin: '40px auto',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: '#333',
      lineHeight: '1.6',
      background:'white',
    }}>
      <h2 style={{ color: '#004080', marginBottom: '20px' }}>Welcome to Bondly</h2>
      <p style={{ fontSize: '18px', marginBottom: '12px' }}>
        Bondly is your all-in-one internal platform designed to foster a sense of community among employees—whether remote, hybrid, or on-site.
      </p>
      <p style={{ fontSize: '16px', marginBottom: '24px' }}>
        Connect beyond work through shared interests, mutual support, and real-world conveniences.
      </p>
      <h3 style={{ color: '#004080', marginBottom: '16px' }}>Key Features</h3>
      <ul style={{ fontSize: '16px', paddingLeft: '20px', marginBottom: '32px' }}>
        <li>Buy & Sell: A company-only marketplace for second-hand items</li>
        <li>Travel & Carpooling: Plan travel and find carpool partners</li>
        {/* <li>Local Recommendations: Share and discover coworking spots, cafes, and meetups</li> */}
        <li>Event & Interest Groups: Create and join communities and events</li>
        <li>Skill Swap & Mentorship: Offer or request skill-sharing and mentorship</li>
      </ul>
      {/* {!isLoggedIn && (
        <div style={{ marginBottom: '24px' }}>
          <MicrosoftAuth onLoginChange={handleLoginChange} />
        </div>
      )} */}
      <Dashboard />
    </section>
  );
};

export default Home;
