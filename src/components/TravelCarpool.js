import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TravelCarpool = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [interestedItems, setInterestedItems] = useState(new Set());

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/travel-items");
      if (!res.ok) throw new Error("Failed to fetch travel items");
      const data = await res.json();
      setItems(data);
      setFilteredItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const showInterest = (item) => {
    setInterestedItems((prev) => new Set(prev).add(item._id));
    const email = "yuri.narang@centricconsulting.com";
    const itemUrl = `${window.location.origin}/travel-carpool/add/${item._id}`;
    const message = `Hi, I'm interested in the carpool [from ${
      item.travelFrom
    } to ${item.travelTo} on ${new Date(
      item.date
    ).toLocaleDateString()}](${itemUrl})`;
    const teamsLink = `https://teams.microsoft.com/l/chat/0/0?users=${encodeURIComponent(
      email
    )}&message=${encodeURIComponent(message)}`;
    window.open(teamsLink, "_blank");
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredItems(items);
      return;
    }

    const lowerTerm = term.toLowerCase();
    const filtered = items.filter(
      (item) =>
        item.travelFrom.toLowerCase().includes(lowerTerm) ||
        item.travelTo.toLowerCase().includes(lowerTerm) ||
        (item.description && item.description.toLowerCase().includes(lowerTerm))
    );
    setFilteredItems(filtered);
  };

  return (
    <section style={styles.container}>
      <div style={styles.header}>
        <h2 style={{ margin: 0 }}>Travel & Carpooling</h2>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            type="button"
            style={styles.addBtn}
            onClick={() => navigate(`/travel-carpool/add/`)}
          >
            + Add Carpool
          </button>
          <div style={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Search travels..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              style={styles.searchInput}
            />
            {searchTerm && (
              <span onClick={() => handleSearch("")} style={styles.clearIcon}>
                ×
              </span>
            )}
          </div>
        </div>
      </div>
      <p>
        Plan travel with colleagues for office visits or offsites. Find and
        offer carpool options to save time and cost.
      </p>

      {error && <p style={styles.error}>Error: {error}</p>}

      {loading && filteredItems.length === 0 ? (
        <div>
          <FaSpinner className="spin" style={{ color: "#004080" }} />
          <p>Loading travel items...</p>
        </div>
      ) : (
        <ul style={styles.listGrid}>
          {filteredItems.map((item) => (
            <li key={item._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <strong style={{ fontSize: "18px", color: "#222" }}>
                  {item.travelFrom} → {item.travelTo}
                </strong>
              </div>
              <p style={styles.metaItem}>
                <b>Date:</b> {new Date(item.date).toLocaleDateString("en-GB")}
              </p>
              <p style={styles.metaItem}>
                <b>Passengers:</b> {item.numberOfPassengers}
              </p>

              <div style={styles.actions}>
                <button
                  onClick={() => navigate(`/travel-carpool/add/${item._id}`)}
                  style={{ ...styles.btn, background: "#ffc107" }}
                >
                  Edit
                </button>
                <button
                  onClick={async () => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this carpool?"
                      )
                    ) {
                      try {
                        const res = await fetch(
                          `http://localhost:4000/travel-items/${item._id}`,
                          { method: "DELETE" }
                        );
                        if (!res.ok)
                          throw new Error("Failed to delete carpool");
                        fetchItems();
                      } catch (err) {
                        setError(err.message);
                      }
                    }
                  }}
                  style={{ ...styles.btn, background: "#dc3545" }}
                >
                  Delete
                </button>
                <button
                  onClick={() => showInterest(item)}
                  disabled={interestedItems.has(item._id)}
                  style={{
                    ...styles.btn,
                    background: interestedItems.has(item._id)
                      ? "#6c757d"
                      : "#28a745",
                    cursor: interestedItems.has(item._id)
                      ? "not-allowed"
                      : "pointer",
                  }}
                >
                  {interestedItems.has(item._id)
                    ? "Interested"
                    : "I'm interested"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default TravelCarpool;

const styles = {
  container: {
    maxWidth: "900px",
    margin: "auto",
    padding: "20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: "20px",
  },
  addBtn: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  searchWrapper: {
    position: "relative",
    minWidth: "200px",
    marginLeft: "10px",
  },
  searchInput: {
    padding: "8px 30px 8px 10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  clearIcon: {
    position: "absolute",
    right: "8px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "#999",
    fontWeight: "bold",
    fontSize: "16px",
  },
  error: { color: "red", marginBottom: "1rem", textAlign: "center" },
  listGrid: {
    listStyle: "none",
    padding: 0,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
    gap: "15px",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "5px",
    padding: "15px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #eee",
    marginBottom: "10px",
  },
  metaItem: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "5px",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    marginTop: "10px",
    flexWrap: "wrap",
  },
  btn: {
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    flex: "1 1 30%",
    fontSize: "14px",
  },
};
