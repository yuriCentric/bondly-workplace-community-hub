import React, { useState, useEffect } from "react";

const Dashboard = () => {
  const [buySellEntries, setBuySellEntries] = useState([]);
  const [travelCarpoolEntries, setTravelCarpoolEntries] = useState([]);
  const [localRecommendations, setLocalRecommendations] = useState([]);
  const [eventInterestGroups, setEventInterestGroups] = useState([]);
  const [skillSwapMentorship, setSkillSwapMentorship] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllEntries = async () => {
      setLoading(true);
      setError(null);
      try {
        const buySellRes = await fetch("http://localhost:4000/items");
        if (!buySellRes.ok)
          throw new Error("Failed to fetch Buy & Sell entries");
        const buySellData = await buySellRes.json();

        const travelRes = await fetch("http://localhost:4000/travel-items");
        if (!travelRes.ok)
          throw new Error("Failed to fetch Travel & Carpool entries");
        const travelData = await travelRes.json();

        const localRecRes = await fetch(
          "http://localhost:4000/local-recommendations"
        );
        if (!localRecRes.ok)
          throw new Error("Failed to fetch Local Recommendations");
        const localRecData = await localRecRes.json();

        const eventRes = await fetch(
          "http://localhost:4000/event-interest-groups"
        );
        if (!eventRes.ok)
          throw new Error("Failed to fetch Event & Interest Groups");
        const eventData = await eventRes.json();

        const skillSwapRes = await fetch(
          "http://localhost:4000/skill-swap-mentorship"
        );
        if (!skillSwapRes.ok)
          throw new Error("Failed to fetch Skill Swap & Mentorship");
        const skillSwapData = await skillSwapRes.json();

        setBuySellEntries(buySellData);
        setTravelCarpoolEntries(travelData);
        setLocalRecommendations(localRecData);
        setEventInterestGroups(eventData);
        setSkillSwapMentorship(skillSwapData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllEntries();
  }, []);

  if (loading) return <p>Loading dashboard entries...</p>;
  if (error) return <p className="form-error">Error: {error}</p>;

  return (
    <div
      className="dashboard-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "24px",
        padding: "20px",
      }}
    >
      <div
        className="dashboard-tile"
        style={{
          backgroundColor: "#ffffff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          minHeight: "200px",
        }}
      >
        <section>
          <h3 style={{ color: "#004080", marginBottom: "12px" }}>Buy & Sell</h3>
          {buySellEntries.length === 0 ? (
            <p>No entries found.</p>
          ) : (
            <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
              {buySellEntries.map((item) => (
                <li key={item.id} style={{ marginBottom: "8px" }}>
                  <strong>{item.title}</strong>: {item.description}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
      <div
        className="dashboard-tile"
        style={{
          backgroundColor: "#ffffff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          minHeight: "200px",
        }}
      >
        <section>
          <h3 style={{ color: "#004080", marginBottom: "12px" }}>
            Travel & Carpooling
          </h3>
          {travelCarpoolEntries.length === 0 ? (
            <p>No entries found.</p>
          ) : (
            <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
              {travelCarpoolEntries.map((item) => (
                <li key={item.id} style={{ marginBottom: "8px" }}>
                  <p>From: {item.travelFrom}</p>
                  <p>To: {item.travelTo}</p>
                  <p>Date: {item.date}</p>
                  <p>Passengers: {item.numberOfPassengers}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
      <div
        className="dashboard-tile"
        style={{
          backgroundColor: "#ffffff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          minHeight: "200px",
        }}
      >
        <section>
          <h3 style={{ color: "#004080", marginBottom: "12px" }}>
            Local Recommendations
          </h3>
          {localRecommendations.length === 0 ? (
            <p>No entries found.</p>
          ) : (
            <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
              {localRecommendations.map((item) => (
                <li key={item.id} style={{ marginBottom: "8px" }}>
                  {item.description}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
      <div
        className="dashboard-tile"
        style={{
          backgroundColor: "#ffffff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          minHeight: "200px",
        }}
      >
        <section>
          <h3 style={{ color: "#004080", marginBottom: "12px" }}>
            Event & Interest Groups
          </h3>
          {eventInterestGroups.length === 0 ? (
            <p>No entries found.</p>
          ) : (
            <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
              {eventInterestGroups.map((item) => (
                <li key={item.id} style={{ marginBottom: "8px" }}>
                  {item.description}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
      <div
        className="dashboard-tile"
        style={{
          backgroundColor: "#ffffff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          minHeight: "200px",
        }}
      >
        <section>
          <h3 style={{ color: "#004080", marginBottom: "12px" }}>
            Skill Swap & Mentorship
          </h3>
          {skillSwapMentorship.length === 0 ? (
            <p>No entries found.</p>
          ) : (
            <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
              {skillSwapMentorship.map((item) => (
                <li key={item.id} style={{ marginBottom: "8px" }}>
                  {item.description}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
