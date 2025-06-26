import React, { useState, useEffect } from 'react';

const BuySell = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    pics: [],
    address: '',
    city: '',
    category: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/items');
      if (!response.ok) throw new Error('Failed to fetch items');
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handler for pics input to convert files to base64 and update form state
  const handlePicsChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      setError('You can upload a maximum of 3 images.');
      return;
    }
    setError(null);
    Promise.all(
      files.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      })
    )
      .then((base64Pics) => {
        setForm((prevForm) => ({ ...prevForm, pics: base64Pics }));
      })
      .catch(() => {
        setError('Failed to read one or more image files');
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.title.trim() === '') return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:4000/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error('Failed to add item');
      const newItem = await response.json();
      setItems([...items, newItem]);
      setForm({
        title: '',
        description: '',
        price: '',
        pics: [],
        address: '',
        city: '',
        category: '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2>Buy & Sell Marketplace</h2>
      <p>
        A company-only marketplace to exchange second-hand items like electronics, furniture, or books—safe, simple, and internal.
      </p>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Item title"
          value={form.title}
          onChange={handleChange}
          required
          disabled={loading}
        />
        <textarea
          name="description"
          placeholder="Item description"
          value={form.description}
          onChange={handleChange}
          disabled={loading}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          disabled={loading}
          min="0"
          step="0.01"
        />
        <input
          type="file"
          name="pics"
          accept="image/*"
          multiple
          onChange={handlePicsChange}
          disabled={loading}
        />
        <small>Upload up to 3 images</small>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          disabled={loading}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          disabled={loading}
        />
        <label htmlFor="category" style={{ display: 'block', marginTop: '10px', marginBottom: '5px', fontWeight: 'bold' }}>
          Category
        </label>
        <select
          id="category"
          name="category"
          value={form.category}
          onChange={handleChange}
          disabled={loading}
          required
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            width: '100%',
            maxWidth: '300px',
            fontSize: '16px',
          }}
        >
          <option value="" disabled>
            Select category
          </option>
          <option value="Electronics">Electronics</option>
          <option value="Furniture">Furniture</option>
          <option value="Books">Books</option>
          <option value="Clothing">Clothing</option>
          <option value="Other">Other</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Add Item'}
        </button>
      </form>
      {loading && items.length === 0 ? (
        <p>Loading items...</p>
      ) : (
        <ul className="item-list">
          {items.map((item) => (
            <li key={item.id}>
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
                      style={{ maxWidth: '100px', maxHeight: '100px', marginRight: '5px' }}
                    />
                  ))}
                </div>
              )}
              <button
                onClick={async () => {
                  if (window.confirm('Are you sure you want to delete this item?')) {
                    try {
                      const response = await fetch(`http://localhost:4000/items/${item.id}`, {
                        method: 'DELETE',
                      });
                      if (!response.ok) throw new Error('Failed to delete item');
                      setItems(items.filter(i => i.id !== item.id));
                    } catch (err) {
                      setError(err.message);
                    }
                  }
                }}
                disabled={loading}
                style={{ marginTop: '5px', backgroundColor: '#ff4d4f', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
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

export default BuySell;
