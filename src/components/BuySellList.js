import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BuySellList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  const [items, setItems] = useState([]);
  return (
    <section>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0 }}>Buy & Sell Items</h2>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            type="button"
            onClick={() => addEditItem()}
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              padding: "10px 15px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Add Item
          </button>
          <div style={{ position: "relative", minWidth: "200px" }}>
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              style={{
                padding: "8px 30px 8px 10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            {searchTerm && (
              <span
                onClick={() => handleSearch("")}
                style={{
                  position: "absolute",
                  right: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#999",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
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
      {items.length === 0 && !loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <p style={{ margin: 0, fontSize: "16px", color: "#666" }}>
            No items found.
          </p>
        </div>
      )}

      {loading && items.length === 0 ? (
        <p>Loading items...</p>
      ) : (
        <ul className="item-list">
          {items.map((item) => (
            <li key={item._id}>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
              {item.price && <p>Price: ${item.price}</p>}
              {item.address && <p>Address: {item.address}</p>}
              {item.city && <p>City: {item.city}</p>}
              {item.category && <p>Category: {item.category}</p>}
              {item.pics && item.pics.length > 0 && (
                <div className="pics">
                  {item.pics.slice(0, 3).map((pic, index) => (
                    <img
                      key={index}
                      src={pic}
                      alt={`Item pic ${index + 1}`}
                      style={{
                        maxWidth: "100px",
                        maxHeight: "100px",
                        marginRight: "5px",
                      }}
                    />
                  ))}
                </div>
              )}
              <button
                onClick={() => addEditItem(item._id)}
                style={{
                  marginTop: "5px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "3px",
                  cursor: "pointer",
                  marginRight: "5px",
                }}
              >
                Edit
              </button>
              <button
                onClick={async () => {
                  if (
                    window.confirm("Are you sure you want to delete this item?")
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
                  marginTop: "5px",
                  backgroundColor: "#ff4d4f",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "3px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default BuySellList;
