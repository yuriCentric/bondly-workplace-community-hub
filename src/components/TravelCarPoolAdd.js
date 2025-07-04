import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const TravelCarpoolAdd = () => {
  const navigate = useNavigate();
  const id = useParams().id;
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    travelFrom: "",
    travelTo: "",
    date: "",
    numberOfPassengers: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      navigate("/travel-carpool");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchItem = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/travel-items/${id}`);
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
    if (id) fetchItem();
  }, [id]);

  return (
    <section
      style={{
        padding: "2rem",
        fontFamily: "sans-serif",
        maxWidth: "500px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h2 style={{ margin: 0 }}>Add your plan</h2>
        <button
          onClick={() => window.history.back()}
          style={{
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            padding: "8px 14px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Back
        </button>
      </div>

      {error && (
        <p style={{ color: "red", marginBottom: "1rem", textAlign: "center" }}>
          Error: {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <input
          type="text"
          name="travelFrom"
          placeholder="Travel from"
          value={form.travelFrom}
          onChange={handleChange}
          required
          disabled={loading}
          style={{
            padding: "10px",
            fontSize: "1rem",
            width: "100%",
            boxSizing: "border-box",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="text"
          name="travelTo"
          placeholder="Travel to"
          value={form.travelTo}
          onChange={handleChange}
          required
          disabled={loading}
          style={{
            padding: "10px",
            fontSize: "1rem",
            width: "100%",
            boxSizing: "border-box",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          disabled={loading}
          style={{
            padding: "10px",
            fontSize: "1rem",
            width: "100%",
            boxSizing: "border-box",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="number"
          name="numberOfPassengers"
          placeholder="Number of passengers"
          value={form.numberOfPassengers}
          onChange={handleChange}
          min="1"
          disabled={loading}
          style={{
            padding: "10px",
            fontSize: "1rem",
            width: "100%",
            boxSizing: "border-box",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px",
            fontSize: "1rem",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {loading ? "Saving..." : "Add Travel/Carpool"}
        </button>
      </form>
    </section>
  );
};

export default TravelCarpoolAdd;
