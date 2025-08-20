import React from "react";
import "./Contact.css";

const Contact = () => {
  return (
    <div className="page contact">
      <h1>Contactez-nous</h1>
      <p>Vous avez une question ? Remplissez le formulaire ci-dessous ou contactez-nous directement.</p>

      <form className="contact-form">
        <label>Nom :</label>
        <input type="text" placeholder="Votre nom" />

        <label>Email :</label>
        <input type="email" placeholder="Votre email" />

        <label>Message :</label>
        <textarea placeholder="Votre message..."></textarea>

        <button type="submit">Envoyer</button>
      </form>

      <div className="contact-info">
        <p>Email : support@coursy.com</p>
        <p>Téléphone : +216 22 333 444</p>
        <p>Adresse : Tunis, Tunisie</p>
      </div>
    </div>
  );
};

export default Contact;
