import React, { useState } from "react";
import axios from "axios";
import "./Contact.css";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", content: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/messages", form);
      alert("Message envoyé ✅");
      setForm({ name: "", email: "", content: "" });
    } catch (err) {
      alert("Erreur lors de l’envoi ❌");
    }
  };

  return (
    <div className="page contact">
      <h1>Contactez-nous</h1>
      <form className="contact-form" onSubmit={handleSubmit}>
        <label>Nom :</label>
        <input name="name" value={form.name} onChange={handleChange} />

        <label>Email :</label>
        <input name="email" value={form.email} onChange={handleChange} />

        <label>Message :</label>
        <textarea name="content" value={form.content} onChange={handleChange} />

        <button type="submit">Envoyer</button>
      </form>
    </div>
  );
};

export default Contact;
