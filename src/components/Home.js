import React from 'react';
import Dashboard from './Dashboard';

const Home = () => {
  return (
    <section>
      <h2>Welcome to Bondly</h2>
      <p>
        Bondly is your all-in-one internal platform designed to foster a sense of community among employees—whether remote, hybrid, or on-site.
      </p>
      <p>
        Connect beyond work through shared interests, mutual support, and real-world conveniences.
      </p>
      <h3>Key Features</h3>
      <ul>
        <li>Buy & Sell: A company-only marketplace for second-hand items</li>
        <li>Travel & Carpooling: Plan travel and find carpool partners</li>
        <li>Local Recommendations: Share and discover coworking spots, cafes, and meetups</li>
        <li>Event & Interest Groups: Create and join communities and events</li>
        <li>Skill Swap & Mentorship: Offer or request skill-sharing and mentorship</li>
      </ul>
      <Dashboard />
    </section>
  );
};

export default Home;
