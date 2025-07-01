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
        electronics, furniture, or books—safe, simple, and internal.
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
        <ul style={{ listStyle: "none", padding: 0 }}>
          {items.map((item) => (
            <li
              key={item._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "5px",
                padding: "15px",
                marginBottom: "15px",
              }}
            >
              <strong>{item.title}</strong>
              <p>{item.description}</p>
              {item.price && (
                <p>
                  <b>Price:</b> ${item.price}
                </p>
              )}
              {item.address && (
                <p>
                  <b>Address:</b> {item.address}
                </p>
              )}
              {item.city && (
                <p>
                  <b>City:</b> {item.city}
                </p>
              )}
              {item.category && (
                <p>
                  <b>Category:</b> {item.category}
                </p>
              )}
              {item.pics?.length > 0 && (
                <div
                  style={{ display: "flex", gap: "10px", marginTop: "10px" }}
                >
                  {item.pics.slice(0, 3).map((pic, index) => (
                    <img
                      key={index}
                      src={pic}
                      alt={`Item pic ${index + 1}`}
                      style={{
                        maxWidth: "100px",
                        maxHeight: "100px",
                        objectFit: "cover",
                        borderRadius: "5px",
                      }}
                    />
                  ))}
                </div>
              )}
              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={() => contactSeller(item._id, item.title)}
                  style={{ ...buttonStyle, backgroundColor: "#007bff" }}
                >
                  Connect Seller
                </button>
                <button
                  onClick={() => addEditItem(item._id)}
                  style={{
                    ...buttonStyle,
                    backgroundColor: "#007bff",
                    marginLeft: "10px",
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
                    backgroundColor: "#ff4d4f",
                    marginLeft: "10px",
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

// 🔹 Styles
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
