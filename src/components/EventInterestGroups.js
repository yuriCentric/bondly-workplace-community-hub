import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EventInterestGroups = () => {
  const [items, setItems] = useState([]);
  const [type, setType] = useState("Event");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [interestedItems, setInterestedItems] = useState(new Set());

  const fetchItems = async () => {
    try {
      const res = await fetch("http://localhost:4000/event-interest-groups");
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    try {
      const res = await fetch(
        `http://localhost:4000/event-interest-groups/${id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete");
      setItems(items.filter((i) => i._id !== id));
    } catch (err) {
      alert("Error deleting item");
    }
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
    if (text.trim() === "") {
      fetchItems();
    } else {
      const filtered = items.filter(
        (i) =>
          i.title.toLowerCase().includes(text.toLowerCase()) ||
          i.description.toLowerCase().includes(text.toLowerCase())
      );
      setItems(filtered);
    }
  };

  const filtered = items.filter((i) => i.category === type);

  return (
    <section style={{ maxWidth: "900px", margin: "auto" }}>
      <div style={styles.header}>
        <h2>{type}s</h2>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={styles.select}
          >
            <option value="Event">Event</option>
            <option value="Interest Group">Interest Group</option>
          </select>
          <button
            onClick={() => navigate("/event-interest-groups/add")}
            style={styles.addBtn}
          >
            + Add {type}
          </button>
          <div style={styles.searchWrapper}>
            <input
              type="text"
              placeholder={`Search ${type.toLowerCase()}s...`}
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

      {error && <p style={{ color: "red" }}>{error}</p>}

      {filtered.length === 0 ? (
        <p>No {type}s found.</p>
      ) : (
        <ul style={styles.listGrid}>
          {filtered.map((item) => (
            <li key={item._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <strong style={{ fontSize: "20px", color: "#222" }}>
                  {item.title}
                </strong>
              </div>
              <p style={{ color: "#444", fontSize: "15px" }}>
                {item.description}
              </p>
              <div style={styles.meta}>
                {item.date && (
                  <p style={styles.metaItem}>
                    <b>Date:</b> {item.date}
                  </p>
                )}
                {item.time && (
                  <p style={styles.metaItem}>
                    <b>Time:</b> {item.time}
                  </p>
                )}
                {item.location && (
                  <p style={styles.metaItem}>
                    <b>Location:</b> {item.location}
                  </p>
                )}
                {item.department && (
                  <p style={styles.metaItem}>
                    <b>Dept:</b> {item.department}
                  </p>
                )}
                {item.audience && (
                  <p style={styles.metaItem}>
                    <b>Audience:</b> {item.audience}
                  </p>
                )}
                <p style={styles.metaItem}>
                  <b>Posted by:</b> {item.postedBy}
                </p>
              </div>

              <div style={styles.actions}>
                <button
                  onClick={() =>
                    navigate(`/event-interest-groups/add/${item._id}`)
                  }
                  style={{
                    ...styles.btn,
                    background: "#ffc107",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  style={{ ...styles.btn, background: "#dc3545" }}
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setInterestedItems((prev) => new Set(prev).add(item._id));
                    const msg = `Hello, I'm interested in your ${type.toLowerCase()} [${
                      item.title
                    }](${window.location.origin}/event-interest-groups/add/${
                      item._id
                    }).`;
                    window.open(
                      `https://teams.microsoft.com/l/chat/0/0?users=${
                        item.postedBy
                      }&message=${encodeURIComponent(msg)}`
                    );
                  }}
                  style={{
                    ...styles.btn,
                    background: interestedItems.has(item._id)
                      ? "#6c757d"
                      : "#28a745",
                    cursor: interestedItems.has(item._id)
                      ? "not-allowed"
                      : "pointer",
                  }}
                  disabled={interestedItems.has(item._id)}
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

export default EventInterestGroups;

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: "20px",
  },
  select: {
    padding: "8px",
    marginRight: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
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
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #eee",
    marginBottom: "10px",
  },
  meta: {
    fontSize: "14px",
    color: "#555",
    display: "grid",
    rowGap: "5px",
    marginBottom: "10px",
  },
  metaItem: {
    margin: 0,
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    flexWrap: "wrap",
  },
  btn: {
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    flex: "1 1 30%",
  },
};
