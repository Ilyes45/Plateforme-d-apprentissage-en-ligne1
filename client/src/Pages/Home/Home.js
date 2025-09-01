import React from "react";
import { Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Home.css";

// Import des images utilisées sur la page
import heroimage from "../../images/hero.png";
import image1 from "../../images/image1.png";
import quiz from "../../images/quiz.png";
import communite from "../../images/communite-en-ligne.png";

const Home = () => {
  const navigate = useNavigate(); // Hook pour naviguer entre les pages

  return (
    <div className="home-page">

      {/* ----------------------------------------------------------
          Hero Section : la section principale en haut de la page
      ---------------------------------------------------------- */}
      <div className="hero">
        <div className="hero-text">
          <h1>Bienvenue sur Coursy</h1>
          <p className="slogan">Apprenez. Progressez. Réussissez.</p>
          
          {/* Boutons principaux de la page d'accueil */}
          <div className="hero-buttons">
            <Button
              variant="primary"
              className="hero-btn"
              onClick={() => navigate("/cours")} // Redirection vers la liste des cours
            >
              Découvrir les Cours
            </Button>
            <Button
              variant="outline-light"
              className="hero-btn"
              onClick={() => navigate("/register")} // Redirection vers l'inscription
            >
              S'inscrire
            </Button>
          </div>
        </div>

        {/* Image illustrative du Hero */}
        <div className="hero-image">
          <img
            src={heroimage}
            alt="Learning illustration"
          />
        </div>
      </div>

      {/* ----------------------------------------------------------
          Features Section : les trois avantages ou fonctionnalités
      ---------------------------------------------------------- */}
      <div className="features">

        {/* Carte Feature 1 */}
        <Card className="feature-card">
          <Card.Img variant="top" src={image1} />
          <Card.Body>
            <Card.Title>Contenu Interactif</Card.Title>
            <Card.Text>
              Apprenez à votre rythme avec des cours interactifs et engageants.
            </Card.Text>
          </Card.Body>
        </Card>

        {/* Carte Feature 2 */}
        <Card className="feature-card">
          <Card.Img variant="top" src={quiz} />
          <Card.Body>
            <Card.Title>Quiz & Évaluations</Card.Title>
            <Card.Text>
              Testez vos connaissances et suivez vos progrès facilement.
            </Card.Text>
          </Card.Body>
        </Card>

        {/* Carte Feature 3 */}
        <Card className="feature-card">
          <Card.Img variant="top" src={communite} />
          <Card.Body>
            <Card.Title>Communauté Active</Card.Title>
            <Card.Text>
              Rejoignez une communauté d'apprenants motivés et passionnés.
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Home;
