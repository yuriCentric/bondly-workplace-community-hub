import React from 'react';

const Dashboard = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>User Dashboard</h2>
      <p>Here you can see your entries for all sections.</p>
      <section>
        <h3>Buy & Sell</h3>
        <p>Your buy & sell entries will be listed here.</p>
      </section>
      <section>
        <h3>Travel & Carpooling</h3>
        <p>Your travel & carpool entries will be listed here.</p>
      </section>
      <section>
        <h3>Local Recommendations</h3>
        <p>Your local recommendations will be listed here.</p>
      </section>
      <section>
        <h3>Event & Interest Groups</h3>
        <p>Your event & interest group entries will be listed here.</p>
      </section>
      <section>
        <h3>Skill Swap & Mentorship</h3>
        <p>Your skill swap & mentorship entries will be listed here.</p>
      </section>
    </div>
  );
};

export default Dashboard;
