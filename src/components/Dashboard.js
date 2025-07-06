import React, { useState, useEffect } from "react";

const Dashboard = () => {
  const [buySellEntries, setBuySellEntries] = useState([]);
  const [travelCarpoolEntries, setTravelCarpoolEntries] = useState([]);
  const [localRecommendations, setLocalRecommendations] = useState([]);
  const [eventInterestGroups, setEventInterestGroups] = useState([]);
  const [skillSwapMentorship, setSkillSwapMentorship] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const styles = {
    card: {
      backgroundColor: "#fff",
      borderRadius: "12px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
      padding: "24px",
      transition: "transform 0.2s ease",
    },
    cardHeader: {
      color: "#2c3e50",
      fontSize: "18px",
      marginBottom: "16px",
      borderBottom: "1px solid #eaeaea",
      paddingBottom: "8px",
    },
    emptyText: {
      color: "#999",
      fontStyle: "italic",
    },
    ul: {
      listStyle: "none",
      padding: 0,
      margin: 0,
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    liItem: {
      padding: "12px 16px",
      border: "1px solid #eaeaea",
      borderRadius: "8px",
      backgroundColor: "#fafafa",
      transition: "all 0.2s ease-in-out",
    },
    itemTitle: {
      margin: 0,
      fontWeight: "600",
      fontSize: "16px",
      color: "#333",
    },
    itemDesc: {
      margin: "4px 0 0 0",
      fontSize: "14px",
      color: "#555",
    },
    itemLine: {
      margin: "2px 0",
      fontSize: "14px",
      color: "#444",
    },
  };

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
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "24px",
        padding: "30px",
        background: "#f0f2f5",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      {[
        {
          title: "Buy & Sell",
          entries: buySellEntries,
          render: (item) => (
            <li style={styles.liItem}>
              <h4 style={styles.itemTitle}>{item.title}</h4>
              <p style={styles.itemDesc}>{item.description}</p>
            </li>
          ),
        },
        {
          title: "Travel & Carpooling",
          entries: travelCarpoolEntries,
          render: (item) => (
            <li style={styles.liItem}>
              <p style={styles.itemLine}>
                <b>From:</b> {item.travelFrom}
              </p>
              <p style={styles.itemLine}>
                <b>To:</b> {item.travelTo}
              </p>
              <p style={styles.itemLine}>
                <b>Date:</b> {item.date}
              </p>
              <p style={styles.itemLine}>
                <b>Passengers:</b> {item.numberOfPassengers}
              </p>
            </li>
          ),
         },
        // {
        //   title: "Local Recommendations",
        //   entries: localRecommendations,
        //   render: (item) => (
        //     <li style={styles.liItem}>
        //       <p style={styles.itemDesc}>{item.description}</p>
        //     </li>
        //   ),
        // },
        {
          title: "Event & Interest Groups",
          entries: eventInterestGroups,
          render: (item) => (
            <li style={styles.liItem}>
              <p style={styles.itemDesc}>{item.description}</p>
            </li>
          ),
        },
        {
          title: "Skill Swap & Mentorship",
          entries: skillSwapMentorship,
          render: (item) => (
            <li style={styles.liItem}>
              <p style={styles.itemDesc}>{item.description}</p>
            </li>
          ),
        },
      ].map(({ title, entries, render }) => (
        <div style={styles.card}>
          <h3 style={styles.cardHeader}>{title}</h3>
          {entries.length === 0 ? (
            <p style={styles.emptyText}>No entries found.</p>
          ) : (
            <ul style={styles.ul}>
              {entries.slice(0, 3).map((entry) => render(entry))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
