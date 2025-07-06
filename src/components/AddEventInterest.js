import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AddEventInterest = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [type, setType] = useState("Event");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    department: "",
    audience: "",
    maxParticipants: "",
    category: "Event",
    postedBy: "yuri.narang@centricconsulting.com",
  });

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`http://localhost:4000/event-interest-groups/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setForm(data);
          setType(data.category);
        })
        .catch(() => alert("Failed to fetch data"))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url = id
      ? `http://localhost:4000/event-interest-groups/${id}`
      : "http://localhost:4000/event-interest-groups";
    const method = id ? "PUT" : "POST";

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      navigate("/event-interest-groups");
    } catch {
      alert("Failed to save item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={styles.container}>
      <div style={styles.header}>
        <h2 style={{ margin: 0 }}>{id ? `Edit ${type}` : `Add ${type}`}</h2>
        <div>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setForm((f) => ({ ...f, category: e.target.value }));
            }}
            disabled={!!id}
            style={styles.select}
          >
            <option value="Event">Event</option>
            <option value="Interest Group">Interest Group</option>
          </select>
          <button
            onClick={() => navigate("/event-interest-groups")}
            style={styles.backBtn}
          >
            Back
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          style={{ ...styles.input, resize: "vertical" }}
        />
        {type === "Event" && (
          <>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              style={styles.input}
            />
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              style={styles.input}
            />
          </>
        )}
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="text"
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="text"
          name="audience"
          placeholder="Audience"
          value={form.audience}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="number"
          name="maxParticipants"
          placeholder="Max Participants"
          value={form.maxParticipants}
          onChange={handleChange}
          min={1}
          style={styles.input}
        />
        <button type="submit" disabled={loading} style={styles.submitBtn}>
          {loading ? "Saving..." : id ? `Save ${type}` : `Post ${type}`}
        </button>
      </form>
    </section>
  );
};

const styles = {
  container: { maxWidth: "700px", margin: "auto", padding: "20px" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  select: {
    padding: "8px",
    fontSize: "16px",
    marginRight: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  backBtn: {
    padding: "8px 14px",
    background: "#f44336",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  submitBtn: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default AddEventInterest;
