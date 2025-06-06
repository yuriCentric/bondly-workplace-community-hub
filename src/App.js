import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import BuySell from './components/BuySell';
import TravelCarpool from './components/TravelCarpool';
import LocalRecommendations from './components/LocalRecommendations';
import EventInterestGroups from './components/EventInterestGroups';
import SkillSwapMentorship from './components/SkillSwapMentorship';

const App = () => {
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
          </ul>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buy-sell" element={<BuySell />} />
          <Route path="/travel-carpool" element={<TravelCarpool />} />
          <Route path="/local-recommendations" element={<LocalRecommendations />} />
          <Route path="/event-interest-groups" element={<EventInterestGroups />} />
          <Route path="/skill-swap-mentorship" element={<SkillSwapMentorship />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
