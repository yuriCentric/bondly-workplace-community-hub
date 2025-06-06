import React, { useState, useEffect } from 'react';

const BuySell = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
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
      setForm({ title: '', description: '' });
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
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default BuySell;
