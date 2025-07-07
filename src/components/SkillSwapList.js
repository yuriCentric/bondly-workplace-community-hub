import React, { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SkillSwapList = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [interestedItems, setInterestedItems] = useState(new Set());

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:4000/skill-swap-mentorship"
      );
      if (!response.ok) throw new Error("Failed to fetch skill swap items");
      const data = await response.json();
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

  const addEditItem = (id) => {
    navigate(`/skill-swap-mentorship/add/${id || ""}`);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      fetchItems();
    } else {
      const filteredItems = items.filter(
        (item) =>
          item.skillName.toLowerCase().includes(term.toLowerCase()) ||
          (item.description &&
            item.description.toLowerCase().includes(term.toLowerCase()))
      );
      setItems(filteredItems);
    }
  };

  const deleteItem = async (itemId) => {
    if (
      window.confirm("Are you sure you want to delete this skill swap item?")
    ) {
      try {
        const response = await fetch(
          `http://localhost:4000/skill-swap-mentorship/${itemId}`,
          { method: "DELETE" }
        );
        if (!response.ok) throw new Error("Failed to delete skill swap item");
        setItems(items.filter((i) => i._id !== itemId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleInterest = async (item) => {
    const msg = `Hello, I'm interested in your skill swap for [${item.skillName}](${window.location.origin}/skill-swap-mentorship/add/${item._id})`;
    setInterestedItems((prev) => new Set(prev).add(item._id));
    window.open(
      `https://teams.microsoft.com/l/chat/0/0?users=yuri.narang@centricconsulting.com&message=${encodeURIComponent(
        msg
      )}`
    );
  };

  return (
    <section style={styles.container}>
      <div style={styles.header}>
        <h2 style={{ margin: 0 }}>Skill Swap Items</h2>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            type="button"
            onClick={() => addEditItem()}
            style={styles.addBtn}
          >
            + Add Skill Swap
          </button>
          <div style={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Search skill swaps..."
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
        A company-only platform to offer or learn skills through mentorship and
        skill swapping.
      </p>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {loading && items.length === 0 ? (
        <div>
          <FaSpinner className="spin" style={{ color: "#004080" }} />
          <p>Loading skill swap items...</p>
        </div>
      ) : items.length === 0 ? (
        <div style={styles.empty}>
          <p style={{ margin: 0, fontSize: "16px", color: "#666" }}>
            No skill swap items found.
          </p>
        </div>
      ) : (
        <ul style={styles.listGrid}>
          {items.map((item) => (
            <li key={item._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={{ margin: 0, fontSize: "18px", color: "#2c3e50" }}>
                  {item.skillName}
                </h3>
                <span style={styles.proficiency}>
                  Proficiency: {item.proficiencyLevel}
                </span>
              </div>

              <p style={{ color: "#555", fontSize: "14px" }}>
                {item.description}
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "14px",
                  color: "#444",
                }}
              >
                <span>
                  <b>Skill Type:</b> {item.skillType.join(", ")}
                </span>
                <span>
                  <b>Intent:</b> {item.intent}
                </span>
              </div>

              <div style={styles.actions}>
                <button
                  onClick={() => addEditItem(item._id)}
                  style={{ ...styles.btn, background: "#ffc107" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteItem(item._id)}
                  style={{ ...styles.btn, background: "#dc3545" }}
                >
                  Delete
                </button>
                <button
                  onClick={() => handleInterest(item)}
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

export default SkillSwapList;

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
    marginBottom: "20px",
    flexWrap: "wrap",
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
    width: "100%",
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
  empty: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "200px",
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
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "10px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  proficiency: {
    backgroundColor: "#f2f2f2",
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "13px",
    color: "#333",
    fontWeight: "bold",
    whiteSpace: "nowrap",
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
    fontWeight: "600",
  },
};
