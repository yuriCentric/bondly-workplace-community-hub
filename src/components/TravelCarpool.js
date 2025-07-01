import React, { useState, useEffect } from "react";

const TravelCarpool = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    travelFrom: "",
    travelTo: "",
    date: "",
    numberOfPassengers: "",
  });
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.travelFrom.trim() === "" || form.travelTo.trim() === "") return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:4000/travel-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to add travel item");
      const newItem = await res.json();
      setItems([...items, newItem]);
      setForm({
        travelFrom: "",
        travelTo: "",
        date: "",
        numberOfPassengers: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Inline styles using CSS Grid and Flexbox
  const styles = {
    section: { padding: "2rem", fontFamily: "sans-serif" },
    form: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "1rem",
      maxWidth: "800px",
      margin: "0 auto 2rem",
      alignItems: "end",
    },
    input: {
      padding: "0.5rem",
      fontSize: "1rem",
      width: "100%",
      boxSizing: "border-box",
    },
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
      <h2>Travel & Carpooling</h2>
      <p>
        Plan travel with colleagues for office visits or offsites. Find and
        offer carpool options to save time and cost.
      </p>

      {error && <p style={styles.error}>Error: {error}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="travelFrom"
          placeholder="Travel from"
          value={form.travelFrom}
          onChange={handleChange}
          required
          disabled={loading}
          style={styles.input}
        />
        <input
          type="text"
          name="travelTo"
          placeholder="Travel to"
          value={form.travelTo}
          onChange={handleChange}
          required
          disabled={loading}
          style={styles.input}
        />
        <input
          type="date"
          name="date"
          placeholder="Date"
          value={form.date}
          onChange={handleChange}
          disabled={loading}
          style={styles.input}
        />
        <input
          type="number"
          name="numberOfPassengers"
          placeholder="Number of passengers"
          value={form.numberOfPassengers}
          onChange={handleChange}
          min="1"
          disabled={loading}
          style={styles.input}
        />
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Saving..." : "Add Travel/Carpool"}
        </button>
      </form>

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
