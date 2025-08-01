import React, { useState, useEffect } from "react";

function FoodForm({ onAdd, lat, lng }) {
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!lat || !lng || !description || !name || !phone) return;
    onAdd({ lat, lng, description, name, phone });
    setDescription("");
    setName("");
    setPhone("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ textAlign: "center", margin: "10px" }}>
      <div><strong>📍 Click on the map to select a location</strong></div>

      <input type="text" placeholder="Latitude" value={lat} readOnly />
      <input type="text" placeholder="Longitude" value={lng} readOnly />

      <input
        type="text"
        placeholder="Food Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="tel"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />
      <button type="submit">Share Food</button>
    </form>
  );
}

export default FoodForm;
