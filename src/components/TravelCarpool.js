import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TravelCarpool = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [interestedItems, setInterestedItems] = useState(new Set());

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

  const showInterest = async (item) => {
    setInterestedItems((prev) => new Set(prev).add(item._id));
    const email = "yuri.narang@centricconsulting.com";
    const itemUrl = `http://localhost:3000/travel-carpool/add/${item._id}`;
    const message = `Hi, I'm interested in the carpool [from ${
      item.travelFrom
    } to ${item.travelTo} on ${new Date(
      item.date
    ).toLocaleDateString()}.](${itemUrl})`;
    const teamsLink = `https://teams.microsoft.com/l/chat/0/0?users=${encodeURIComponent(
      email
    )}&message=${encodeURIComponent(message)}`;
    window.open(teamsLink, "_blank");
  };

  // Updated styles to match BuySell.js UI
  const styles = {
    section: {
      maxWidth: "700px",
      margin: "30px auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      border: "1px solid #ddd",
      borderRadius: "8px",
      boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
    },
    button: {
      gridColumn: "1 / -1",
      padding: "0.75rem",
      fontSize: "1rem",
      backgroundColor: "#4CAF50",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
    error: { color: "red", marginBottom: "1rem", textAlign: "center" },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "1rem",
    },
    card: {
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      backgroundColor: "#fff",
      boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
      transition: "0.3s ease",
    },

    deleteBtn: {
      padding: "0.6rem",
      backgroundColor: "#f44336",
      color: "#fff",
      border: "none",
      cursor: "pointer",
      borderRadius: "5px",
      fontSize: "14px",
      transition: "background 0.2s ease",
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
          style={styles.button}
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
        <div>
          <FaSpinner
            className="spin"
            style={{ marginRight: "8px", color: "#004080" }}
          />
          <p>Loading travel items...</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {items.map((item) => {
            const formattedDate = new Date(item.date).toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            });

            return (
              <div
                key={item._id}
                style={{
                  ...styles.card,
                  backgroundColor: "#ffffff",
                  transition: "0.3s",
                  border: "1px solid #ddd",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                    fontSize: "15px",
                    fontWeight: 500,
                    color: "#2c3e50",
                  }}
                >
                  <div>
                    <span style={{ color: "#555" }}>From:</span>{" "}
                    {item.travelFrom}
                  </div>
                  <div>
                    <span style={{ color: "#555" }}>To:</span> {item.travelTo}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                    fontSize: "14px",
                    color: "#666",
                  }}
                >
                  <span>
                    <b>Date:</b> {formattedDate}
                  </span>
                </div>

                <div
                  style={{
                    textAlign: "center",
                    fontSize: "14px",
                    color: "#444",
                    margin: "10px 0",
                    padding: "8px 0",
                    backgroundColor: "#f1f1f1",
                    borderRadius: "6px",
                    fontWeight: "bold",
                  }}
                >
                  Passenger
                  {item.numberOfPassengers > 1 ? "s" : ""}:{" "}
                  {item.numberOfPassengers}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "1rem",
                  }}
                >
                  <button
                    onClick={() => navigate(`/travel-carpool/edit/${item._id}`)}
                    disabled={loading}
                    style={{
                      padding: "0.5rem 1rem",
                      background: "#ffc107",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Edit
                  </button>

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
                  <button
                    onClick={() => showInterest(item)}
                    disabled={loading || interestedItems.has(item._id)}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: interestedItems.has(item._id)
                        ? "#6c757d"
                        : "#28a745",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: interestedItems.has(item._id)
                        ? "not-allowed"
                        : "pointer",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    {interestedItems.has(item._id)
                      ? "Interested"
                      : "I'm interested"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default TravelCarpool;
