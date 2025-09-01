import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  // 🔹 Fonction pour remonter en haut de la page avec animation fluide
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* 🔹 Logo et description de la plateforme */}
        <div className="footer-section">
          <h2 className="footer-logo">Coursy</h2>
          <p>Plateforme d'apprentissage en ligne pour développer vos compétences.</p>
        </div>

        {/* 🔹 Liens utiles de navigation */}
        <div className="footer-section">
          <h3>Navigation</h3>
          <ul>
            {/* 🔹 Chaque lien déclenche scroll vers le haut */}
            <li><Link to="/" onClick={scrollToTop}>Accueil</Link></li>
            <li><Link to="/cours" onClick={scrollToTop}>Cours</Link></li>
            <li><Link to="/contact" onClick={scrollToTop}>Contact</Link></li>
            <li><Link to="/apropos" onClick={scrollToTop}>À propos</Link></li>
          </ul>
        </div>

        {/* 🔹 Icônes et liens vers les réseaux sociaux */}
        <div className="footer-section">
          <h3>Suivez-nous</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebook /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer"><FaLinkedin /></a>
          </div>
        </div>
      </div>

      {/* 🔹 Bas de page : copyright */}
      <div className="footer-bottom">
        <p>© 2025 SkillHub. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;
