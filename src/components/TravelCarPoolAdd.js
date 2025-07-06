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
  const [fromOffice, setFromOffice] = useState(false);
  const [toOffice, setToOffice] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOfficeToggle = (field) => {
    if (field === "from") {
      const isChecked = !fromOffice;
      setFromOffice(isChecked);
      setToOffice(false);
      setForm({
        ...form,
        travelFrom: isChecked ? "Gurgaon Office" : "",
        travelTo: isChecked ? form.travelTo : form.travelTo,
      });
    } else if (field === "to") {
      const isChecked = !toOffice;
      setToOffice(isChecked);
      setFromOffice(false);
      setForm({
        ...form,
        travelTo: isChecked ? "Gurgaon Office" : "",
        travelFrom: isChecked ? form.travelFrom : form.travelFrom,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.travelFrom.trim() === "" || form.travelTo.trim() === "") return;
    setLoading(true);
    setError(null);
    try {
      const url = id
        ? `http://localhost:4000/travel-items/${id}`
        : "http://localhost:4000/travel-items";
      const method = id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(id ? "Failed to update travel item" : "Failed to add travel item");
      const newItem = await res.json();
      setItems(id ? items.map(item => item._id === id ? newItem : item) : [...items, newItem]);
      setForm({
        travelFrom: "",
        travelTo: "",
        date: "",
        numberOfPassengers: "",
      });
      setFromOffice(false);
      setToOffice(false);
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
      if (!res.ok) throw new Error("Failed to fetch travel item");
      const data = await res.json();
      setForm({
        travelFrom: data.travelFrom || "",
        travelTo: data.travelTo || "",
        date: data.date ? data.date.split("T")[0] : "",
        numberOfPassengers: data.numberOfPassengers || "",
      });
      setFromOffice(data.travelFrom === "Gurgaon Office");
      setToOffice(data.travelTo === "Gurgaon Office");
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
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <label>
          <input
            type="checkbox"
            checked={fromOffice}
            disabled={toOffice}
            onChange={() => handleOfficeToggle("from")}
            style={{ marginRight: "6px" }}
          />
          From Office
        </label>
        <input
          type="text"
          name="travelFrom"
          placeholder="Travel from"
          value={form.travelFrom}
          onChange={handleChange}
          required
          disabled={fromOffice || loading}
          style={inputStyle}
        />

        <label>
          <input
            type="checkbox"
            checked={toOffice}
            disabled={fromOffice}
            onChange={() => handleOfficeToggle("to")}
            style={{ marginRight: "6px" }}
          />
          To Office
        </label>
        <input
          type="text"
          name="travelTo"
          placeholder="Travel to"
          value={form.travelTo}
          onChange={handleChange}
          required
          disabled={toOffice || loading}
          style={inputStyle}
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          disabled={loading}
          style={inputStyle}
        />
        <input
          type="number"
          name="numberOfPassengers"
          placeholder="Number of passengers"
          value={form.numberOfPassengers}
          onChange={handleChange}
          min="1"
          disabled={loading}
          style={inputStyle}
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

const inputStyle = {
  padding: "10px",
  fontSize: "1rem",
  width: "100%",
  boxSizing: "border-box",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

export default TravelCarpoolAdd;
