import React, { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import BuySell from './components/BuySell';
import TravelCarpool from './components/TravelCarpool';
import LocalRecommendations from './components/LocalRecommendations';
import EventInterestGroups from './components/EventInterestGroups';
import SkillSwapMentorship from './components/SkillSwapMentorship';
import LoginMenu from './components/LoginMenu';
import Dashboard from './components/Dashboard';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      <header>
        <h1>Bondly – Your Workplace Community Hub</h1>
        <nav>
          <ul>
            <li><NavLink to="/" end>Home</NavLink></li>
            <li><NavLink to="/buy-sell">Buy & Sell</NavLink></li>
            <li><NavLink to="/travel-carpool">Travel & Carpooling</NavLink></li>
            <li><NavLink to="/local-recommendations">Local Recommendations</NavLink></li>
            <li><NavLink to="/event-interest-groups">Event & Interest Groups</NavLink></li>
            <li><NavLink to="/skill-swap-mentorship">Skill Swap & Mentorship</NavLink></li>
            <li><NavLink to="/dashboard">Dashboard</NavLink></li>
          </ul>
        </nav>
        <div style={{
          float: 'right',
          marginRight: '20px',
          alignItems: 'center',
          backgroundColor: '#f0f0f0',
          padding: '8px 12px',
          borderRadius: '8px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
        }}>
          <LoginMenu onLoginChange={setIsLoggedIn} />
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buy-sell" element={<BuySell />} />
          <Route path="/travel-carpool" element={<TravelCarpool />} />
          <Route path="/local-recommendations" element={<LocalRecommendations />} />
          <Route path="/event-interest-groups" element={<EventInterestGroups />} />
          <Route path="/skill-swap-mentorship" element={<SkillSwapMentorship />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
