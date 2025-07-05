import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BuySellList = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/items");
      if (!response.ok) throw new Error("Failed to fetch items");
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
    navigate(`/buy-sell-add/${id || ""}`);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      fetchItems();
    } else {
      const filteredItems = items.filter(
        (item) =>
          item.title.toLowerCase().includes(term.toLowerCase()) ||
          item.description.toLowerCase().includes(term.toLowerCase())
      );
      setItems(filteredItems);
    }
  };

  const contactSeller = (itemId, itemName) => {
    const email = "yuri.narang@centricconsulting.com";
    const itemUrl = `http://localhost:3000/buy-sell-add/${itemId}`;
    const message = `Hello, I am interested in the item [${itemName}](${itemUrl}).`;
    const teamsLink = `https://teams.microsoft.com/l/chat/0/0?users=${encodeURIComponent(
      email
    )}&message=${encodeURIComponent(message)}`;
    window.open(teamsLink, "_blank");
  };

  return (
    <section style={{ maxWidth: "900px", margin: "auto", padding: "20px" }}>
      <div style={headerStyle}>
        <h2 style={{ margin: 0 }}>Buy & Sell Items</h2>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            type="button"
            onClick={() => addEditItem()}
            style={addButtonStyle}
          >
            Add Item
          </button>
          <div style={searchWrapperStyle}>
            <input
              type="text"
              placeholder="Search items..."
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
        A company-only marketplace to exchange second-hand items like
        electronics, furniture, or books—safe, simple, internal.
      </p>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {items.length === 0 && !loading && (
        <div style={emptyStyle}>
          <p style={{ margin: 0, fontSize: "16px", color: "#666" }}>
            No items found.
          </p>
        </div>
      )}

      {loading && items.length === 0 ? (
        <p>Loading items...</p>
      ) : (
        <ul style={listGridStyle}>
          {items.map((item) => (
            <li
              key={item._id}
              style={{
                ...cardStyle,
                backgroundColor: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                transition: "0.3s ease-in-out",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid #eee",
                }}
              >
                <strong style={{ fontSize: "20px", color: "#222" }}>
                  {item.title}
                </strong>
                {item.price && (
                  <span
                    style={{
                      fontWeight: "bold",
                      color: "#28a745",
                      fontSize: "18px",
                    }}
                  >
                    Rs. {item.price}
                  </span>
                )}
              </div>

              <p
                style={{
                  color: "#444",
                  fontSize: "15px",
                  lineHeight: "1.6",
                }}
              >
                {item.description}
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  rowGap: "10px",
                  columnGap: "20px",
                  marginBottom: "10px",
                }}
              >
                {item.address && (
                  <p style={{ margin: 0, color: "#555", fontSize: "14px" }}>
                    <b>Address:</b> {item.address}
                  </p>
                )}
                {item.city && (
                  <p
                    style={{
                      margin: 0,
                      textAlign: "right",
                      color: "#555",
                      fontSize: "14px",
                    }}
                  >
                    <b>City:</b> {item.city}
                  </p>
                )}
                {item.category && (
                  <p
                    style={{
                      gridColumn: "1 / -1",
                      textAlign: "center",
                      color: "#666",
                      fontSize: "14px",
                    }}
                  >
                    <b>Category:</b> {item.category}
                  </p>
                )}
              </div>

              {item.pics?.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "12px",
                    marginBottom: "15px",
                  }}
                >
                  {item.pics.slice(0, 3).map((pic, index) => (
                    <img
                      key={index}
                      src={pic}
                      alt={`Item pic ${index + 1}`}
                      style={{
                        width: "150px",
                        height: "90px",
                        objectFit: "cover",
                        borderRadius: "6px",
                        border: "1px solid #ddd",
                      }}
                    />
                  ))}
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <button
                  onClick={() => contactSeller(item._id, item.title)}
                  style={{
                    ...buttonStyle,
                    backgroundColor: "#007bff",
                    flex: "1 1 30%",
                  }}
                >
                  Connect
                </button>
                <button
                  onClick={() => addEditItem(item._id)}
                  style={{
                    ...buttonStyle,
                    backgroundColor: "#17a2b8",
                    flex: "1 1 30%",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={async () => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this item?"
                      )
                    ) {
                      try {
                        const response = await fetch(
                          `http://localhost:4000/items/${item._id}`,
                          {
                            method: "DELETE",
                          }
                        );
                        if (!response.ok)
                          throw new Error("Failed to delete item");
                        setItems(items.filter((i) => i._id !== item._id));
                      } catch (err) {
                        setError(err.message);
                      }
                    }
                  }}
                  disabled={loading}
                  style={{
                    ...buttonStyle,
                    backgroundColor: "#dc3545",
                    flex: "1 1 30%",
                  }}
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
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  backgroundColor: "#fff",
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

export default BuySellList;
