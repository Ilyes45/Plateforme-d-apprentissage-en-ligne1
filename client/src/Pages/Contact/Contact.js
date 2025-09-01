import React, { useState } from "react";
import axios from "axios";
import "./Contact.css";

const Contact = () => {
  // État local pour stocker les valeurs du formulaire
  const [form, setForm] = useState({ name: "", email: "", content: "" });

  // Met à jour l'état à chaque changement dans les champs du formulaire
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    try {
      // Envoie les données au backend
      await axios.post("http://localhost:3000/api/messages", form);
      alert("Message envoyé ✅"); // Confirmation à l'utilisateur
      // Réinitialise le formulaire après envoi
      setForm({ name: "", email: "", content: "" });
    } catch (err) {
      alert("Erreur lors de l’envoi ❌"); // Message d'erreur
    }
  };

  return (
    <div className="page contact">
      <h1>Contactez-nous</h1>
      <form className="contact-form" onSubmit={handleSubmit}>
        {/* Champ Nom */}
        <label>Nom :</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Votre nom"
        />

        {/* Champ Email */}
        <label>Email :</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Votre email"
        />

        {/* Champ Message */}
        <label>Message :</label>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Votre message"
        />

        {/* Bouton de soumission */}
        <button type="submit">Envoyer</button>
      </form>
    </div>
  );
};

export default Contact;
