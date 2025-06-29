import React, { useState, useEffect } from 'react';

const TravelCarpool = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    travelFrom: '',
    travelTo: '',
    date: '',
    numberOfPassengers: '',
  });
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
    if (form.travelFrom.trim() === '' || form.travelTo.trim() === '') return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:4000/travel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error('Failed to add travel item');
      const newItem = await response.json();
      setItems([...items, newItem]);
      setForm({
        travelFrom: '',
        travelTo: '',
        date: '',
        numberOfPassengers: '',
      });
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
      {error && <p className="form-error">Error: {error}</p>}
      <form onSubmit={handleSubmit} className="modern-form">
        <div className="form-group">
          <input
            type="text"
            name="travelFrom"
            placeholder="Travel from"
            value={form.travelFrom}
            onChange={handleChange}
            required
            disabled={loading}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="travelTo"
            placeholder="Travel to"
            value={form.travelTo}
            onChange={handleChange}
            required
            disabled={loading}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <input
            type="date"
            name="date"
            placeholder="Date"
            value={form.date}
            onChange={handleChange}
            disabled={loading}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            name="numberOfPassengers"
            placeholder="Number of passengers"
            value={form.numberOfPassengers}
            onChange={handleChange}
            min="1"
            disabled={loading}
            className="form-input"
          />
        </div>
        <button type="submit" disabled={loading} className="form-button">
          {loading ? 'Saving...' : 'Add Travel/Carpool'}
        </button>
      </form>
      {loading && items.length === 0 ? (
        <p>Loading travel items...</p>
      ) : (
        <ul className="item-grid">
          {items.map((item) => (
            <li key={item.id} className="item-card">
              <p>From: {item.travelFrom}</p>
              <p>To: {item.travelTo}</p>
              <p>Date: {item.date}</p>
              <p>Passengers: {item.numberOfPassengers}</p>
              <button
                onClick={async () => {
                  if (window.confirm('Are you sure you want to delete this travel item?')) {
                    try {
                      const response = await fetch(`http://localhost:4000/travel/${item.id}`, {
                        method: 'DELETE',
                      });
                      if (!response.ok) throw new Error('Failed to delete travel item');
                      setItems(items.filter(i => i.id !== item.id));
                    } catch (err) {
                      setError(err.message);
                    }
                  }
                }}
                disabled={loading}
                className="delete-button"
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

export default TravelCarpool;
