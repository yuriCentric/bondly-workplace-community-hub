import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function BuySell() {
  const id = useParams().id;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    pics: [],
    address: "",
    city: "",
    category: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePicsChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      setError("You can upload a maximum of 3 images.");
      return;
    }

    setError(null);
    Promise.all(
      files.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      })
    )
      .then((base64Pics) => {
        setForm((prevForm) => ({ ...prevForm, pics: base64Pics }));
      })
      .catch(() => {
        setError("Failed to read one or more image files");
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.title.trim() === "") return;

    setLoading(true);
    setError(null);

    try {
      const url = id
        ? `http://localhost:4000/items/${id}`
        : "http://localhost:4000/items";
      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Failed to save item");
      navigate("/buy-sell");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      const fetchItem = async () => {
        try {
          const response = await fetch(`http://localhost:4000/items/${id}`);
          if (!response.ok) throw new Error("Failed to fetch item");
          const item = await response.json();
          setForm(item);
        } catch (err) {
          setError(err.message);
        }
      };
      fetchItem();
    }
  }, [id]);

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "30px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#fff",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ margin: 0 }}>
          {id ? "Edit Buy/Sell Item" : "Add New Buy/Sell Item"}
        </h2>
        <button
          type="button"
          onClick={() => navigate("/buy-sell")}
          style={{
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            padding: "10px 15px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Back
        </button>
      </div>

      {error && (
        <p style={{ color: "red", fontWeight: "bold" }}>Error: {error}</p>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <label style={{ fontWeight: "bold" }}>Item Title</label>
        <input
          type="text"
          name="title"
          placeholder="Item title"
          value={form.title}
          onChange={handleChange}
          required
          disabled={loading}
          style={inputStyle}
        />

        <label style={{ fontWeight: "bold" }}>Item Description</label>
        <textarea
          name="description"
          placeholder="Item description"
          value={form.description}
          onChange={handleChange}
          disabled={loading}
          style={{ ...inputStyle, height: "100px", resize: "vertical" }}
        />

        <label style={{ fontWeight: "bold" }}>Price (optional)</label>
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          disabled={loading}
          min="0"
          step="0.01"
          style={inputStyle}
        />

        <label style={{ fontWeight: "bold" }}>Upload Images</label>
        <input
          type="file"
          name="pics"
          accept="image/*"
          multiple
          onChange={handlePicsChange}
          disabled={loading}
          style={{ marginBottom: "5px" }}
        />
        <small style={{ color: "#666", marginBottom: "10px" }}>
          Upload up to 3 images
        </small>

        <label style={{ fontWeight: "bold" }}>Address (optional)</label>
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          disabled={loading}
          style={inputStyle}
        />

        <label style={{ fontWeight: "bold" }}>City</label>
        <input
          type="text"
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          disabled={loading}
          style={inputStyle}
        />

        <label style={{ fontWeight: "bold" }}>Category</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          disabled={loading}
          required
          style={inputStyle}
        >
          <option value="" disabled>
            Select category
          </option>
          <option value="Electronics">Electronics</option>
          <option value="Car">Car</option>
          <option value="Furniture">Furniture</option>
          <option value="Books">Books</option>
          <option value="Clothing">Clothing</option>
          <option value="Other">Other</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "12px",
            fontSize: "16px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          {loading ? "Saving..." : id ? "Save Item" : "Add Item"}
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  fontSize: "16px",
  width: "100%",
};
