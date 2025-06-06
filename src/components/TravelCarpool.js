import React, { useState, useEffect } from 'react';

const TravelCarpool = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/travel-items');
      if (!response.ok) throw new Error('Failed to fetch travel items');
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
      const response = await fetch('http://localhost:4000/travel-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error('Failed to add travel item');
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
      <h2>Travel & Carpooling</h2>
      <p>
        Plan travel with colleagues for office visits or offsites. Find and offer carpool options to save time and cost.
      </p>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Travel or carpool title"
          value={form.title}
          onChange={handleChange}
          required
          disabled={loading}
        />
        <textarea
          name="description"
          placeholder="Details"
          value={form.description}
          onChange={handleChange}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Add Travel/Carpool'}
        </button>
      </form>
      {loading && items.length === 0 ? (
        <p>Loading travel items...</p>
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

export default TravelCarpool;
