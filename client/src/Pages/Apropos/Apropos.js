import React from "react";
import "./Apropos.css";

const Apropos = () => {
  return (
    <div className="page apropos">
      {/* Titre principal */}
      <h1>À propos de Coursy</h1>

      {/* Présentation de la plateforme */}
      <p>
        Coursy est une plateforme d'apprentissage en ligne qui aide les étudiants et professionnels
        à développer leurs compétences dans différents domaines (programmation, design, marketing...).
      </p>

      {/* Section mission */}
      <h2>Notre mission</h2>
      <p>
        Rendre l'apprentissage accessible à tous, n'importe où et à tout moment.
      </p>

      {/* Section avantages / raisons de choisir Coursy */}
      <h2>Pourquoi nous choisir ?</h2>
      <ul>
        <li>Des cours interactifs et pratiques</li>
        <li>Des formateurs expérimentés</li>
        <li>Certificats de réussite</li>
        <li>Communauté d'apprenants active</li>
      </ul>
    </div>
  );
};

export default Apropos;
