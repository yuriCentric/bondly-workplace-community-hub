import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TravelCarpool = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/travel-items");
      if (!res.ok) throw new Error("Failed to fetch travel items");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Inline styles using CSS Grid and Flexbox
  const styles = {
    section: { padding: "2rem", fontFamily: "sans-serif" },
    button: {
      gridColumn: "1 / -1",
      padding: "0.75rem",
      fontSize: "1rem",
      background: "#007bff",
      color: "#fff",
      border: "none",
      cursor: "pointer",
    },
    error: { color: "red", marginBottom: "1rem", textAlign: "center" },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      gap: "1rem",
    },
    card: {
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "1rem",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    deleteBtn: {
      marginTop: "1rem",
      padding: "0.5rem",
      background: "#dc3545",
      color: "#fff",
      border: "none",
      cursor: "pointer",
    },
  };

  return (
    <section style={styles.section}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2 style={{ margin: 0, flex: 1 }}>Travel & Carpooling</h2>
        <button
          type="button"
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            padding: "8px 14px",
            borderRadius: "5px",
            cursor: "pointer",
            marginLeft: "10px",
            whiteSpace: "nowrap",
          }}
          onClick={() => navigate(`/travel-carpool/add/`)}
        >
          Add Carpool
        </button>
      </div>
      <p>
        Plan travel with colleagues for office visits or offsites. Find and
        offer carpool options to save time and cost.
      </p>

      {error && <p style={styles.error}>Error: {error}</p>}

      {loading && items.length === 0 ? (
        <p>Loading travel items...</p>
      ) : (
        <div style={styles.grid}>
          {items.map((item) => (
            <div key={item._id} style={styles.card}>
              <p>
                <strong>From:</strong> {item.travelFrom}
              </p>
              <p>
                <strong>To:</strong> {item.travelTo}
              </p>
              <p>
                <strong>Date:</strong> {item.date}
              </p>
              <p>
                <strong>Passengers:</strong> {item.numberOfPassengers}
              </p>
              <button
                onClick={async () => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete this travel item?"
                    )
                  ) {
                    try {
                      const res = await fetch(
                        `http://localhost:4000/travel-items/${item._id}`,
                        { method: "DELETE" }
                      );
                      if (!res.ok)
                        throw new Error("Failed to delete travel item");
                      setItems(items.filter((i) => i._id !== item._id));
                    } catch (err) {
                      setError(err.message);
                    }
                  }
                }}
                disabled={loading}
                style={styles.deleteBtn}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default TravelCarpool;
