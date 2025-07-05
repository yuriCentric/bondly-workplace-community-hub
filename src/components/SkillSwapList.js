import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SkillSwapList = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/skill-swap-mentorship");
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
    navigate(`/skill-swap-add/${id || ""}`);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      fetchItems();
    } else {
      const filteredItems = items.filter(
        (item) =>
          item.skillName.toLowerCase().includes(term.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(term.toLowerCase()))
      );
      setItems(filteredItems);
    }
  };

  const deleteItem = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this skill swap item?")) {
      try {
        const response = await fetch(`http://localhost:4000/skill-swap-mentorship/${itemId}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete skill swap item");
        setItems(items.filter((i) => i._id !== itemId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <section style={{ maxWidth: "900px", margin: "auto", padding: "20px" }}>
      <div style={headerStyle}>
        <h2 style={{ margin: 0 }}>Skill Swap Items</h2>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button type="button" onClick={() => addEditItem()} style={addButtonStyle}>
            Add Skill Swap
          </button>
          <div style={searchWrapperStyle}>
            <input
              type="text"
              placeholder="Search skill swaps..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              style={searchInputStyle}
            />
            {searchTerm && (
              <span onClick={() => handleSearch("")} style={clearIconStyle}>
                ×
              </span>
            )}
          </div>
        </div>
      </div>

      <p>
        A company-only platform to offer or learn skills through mentorship and skill swapping.
      </p>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {items.length === 0 && !loading && (
        <div style={emptyStyle}>
          <p style={{ margin: 0, fontSize: "16px", color: "#666" }}>No skill swap items found.</p>
        </div>
      )}

      {loading && items.length === 0 ? (
        <p>Loading skill swap items...</p>
      ) : (
        <ul style={listGridStyle}>
          {items.map((item) => (
            <li key={item._id} style={cardStyle}>
              <strong>{item.skillName}</strong>
              <p>{item.description}</p>
              <p><b>Skill Type:</b> {item.skillType.join(", ")}</p>
              <p><b>Intent:</b> {item.intent}</p>
              <p><b>Proficiency Level:</b> {item.proficiencyLevel}</p>
              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={() => addEditItem(item._id)}
                  style={{ ...buttonStyle, backgroundColor: "#007bff" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteItem(item._id)}
                  disabled={loading}
                  style={{ ...buttonStyle, backgroundColor: "#ff4d4f", marginLeft: "10px" }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

const listGridStyle = {
  listStyle: "none",
  padding: 0,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
  gap: "15px",
};

const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: "5px",
  padding: "15px",
  display: "flex",
  flexDirection: "column",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const addButtonStyle = {
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  padding: "10px 15px",
  borderRadius: "5px",
  cursor: "pointer",
};

const searchWrapperStyle = {
  position: "relative",
  minWidth: "200px",
};

const searchInputStyle = {
  padding: "8px 30px 8px 10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  width: "100%",
};

const clearIconStyle = {
  position: "absolute",
  right: "8px",
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer",
  color: "#999",
  fontWeight: "bold",
  fontSize: "16px",
};

const emptyStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "200px",
};

const buttonStyle = {
  color: "white",
  border: "none",
  padding: "5px 10px",
  borderRadius: "4px",
  cursor: "pointer",
};

export default SkillSwapList;
