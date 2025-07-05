import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function SkillSwapMentorship() {
  const id = useParams().id;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    skillName: "",
    skillType: "",
    intent: "Offer mentorship",
    proficiencyLevel: "Beginner",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const skillTypes = [
    "Technical",
    "Creative",
    "Business",
    "Life Skills",
    "Language",
  ];

  const intents = [
    "Offer mentorship",
    "Learn this skill",
    "Both",
  ];

  const proficiencyLevels = [
    "Beginner",
    "Intermediate",
    "Advanced",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked, options } = e.target;
    if (type === "select-multiple") {
      const selectedOptions = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);
      setForm({ ...form, [name]: selectedOptions });
    } else if (type === "checkbox") {
      if (checked) {
        setForm({ ...form, [name]: [...form[name], value] });
      } else {
        setForm({ ...form, [name]: form[name].filter((v) => v !== value) });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.skillName.trim() === "") return;

    setLoading(true);
    setError(null);

    try {
      const url = id
        ? `http://localhost:4000/skill-swap-mentorship/${id}`
        : "http://localhost:4000/skill-swap-mentorship";
      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Failed to save skill swap item");
      navigate("/skill-swap");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
          {id ? "Edit Skill Swap Item" : "Add New Skill Swap Item"}
        </h2>
        <button
          type="button"
          onClick={() => navigate("/skill-swap")}
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
        <label style={{ fontWeight: "bold" }}>Skill Name</label>
        <input
          type="text"
          name="skillName"
          placeholder="Skill name"
          value={form.skillName}
          onChange={handleChange}
          required
          disabled={loading}
          style={inputStyle}
        />

        <label style={{ fontWeight: "bold" }}>Skill Type</label>
        <select
          name="skillType"
          value={form.skillType}
          onChange={handleChange}
          disabled={loading}
          required
          style={inputStyle}
        >
          <option value="" disabled>
            Select skill type
          </option>
          {skillTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <label style={{ fontWeight: "bold" }}>I want to...</label>
        <select
          name="intent"
          value={form.intent}
          onChange={handleChange}
          disabled={loading}
          required
          style={inputStyle}
        >
          {intents.map((intent) => (
            <option key={intent} value={intent}>
              {intent}
            </option>
          ))}
        </select>

        <label style={{ fontWeight: "bold" }}>Proficiency Level</label>
        <select
          name="proficiencyLevel"
          value={form.proficiencyLevel}
          onChange={handleChange}
          disabled={loading}
          required
          style={inputStyle}
        >
          {proficiencyLevels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>

        <label style={{ fontWeight: "bold" }}>Description (optional)</label>
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          disabled={loading}
          style={{ ...inputStyle, height: "100px", resize: "vertical" }}
        />

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
          {loading ? "Saving..." : id ? "Save Skill Swap" : "Add Skill Swap"}
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
